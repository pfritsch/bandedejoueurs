
Template.gameList.helpers({
  games: function() {
    return Games.find();
  },
  gameSchema: function() {
    return Schema.game;
  },
  suggests: function() {
    return Session.get('suggests');
  },
  // waitForGameChoice: function() {
  //   return Session.get('newGame').choice == undefined;
  // }
});
Template.gameList.events({
  'blur [name="game-title"]': function(e, tpl) {
    var titleGiven = $(e.target).val();
    var category = Session.get('newGame').category;
    if(titleGiven != '') {
      getGamesSuggestByTitle(titleGiven, category);
    }
  },
  'change [name="gameType"]': function(e, tpl) {
    var gameType = tpl.$('[name="gameType"]:checked').val();
    Session.set('newGame', {category: gameType});
    tpl.$('[name="game-title"]').val('');
  },
  'change [name="game-suggested"]': function(e, tpl) {
    tpl.$('[name="game-title"]').val('');
    var suggests = Session.get('suggests');
    var newGame = Session.get('newGame');
    if(newGame.category === 'boardgame'){
      var index = suggests.contains('id',this.id)
      if(index > -1) {
        Meteor.call("getBoardGameImageById", this.id, function(error, result) {
          if (!error) {
            suggests[index].image = {thumb_url: result};
            newGame.choice = suggests[index];
            Session.set('suggests', suggests);
            Session.set('newGame', newGame);
          } else {
            return false;
          }
        });
      }
    } else if(newGame.category === 'videogame'){
      newGame.choice = this;
      Session.set('newGame', newGame);
    }
  }
});

Template.gameList.rendered = function() {
  Session.set('newGame', {category: ''});
};

