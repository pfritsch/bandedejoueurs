Template.gameSuggest.helpers({
  cover: function() {
    var index = this.index;
    var thumbnail = Session.get('suggests')[index].image;
    if(!thumbnail) {
      return '/images/loading.svg'
    } else {
      return thumbnail.thumb_url;
    }
  },
  hasCover: function(){
    if(!this.game.image) return false;
    if(this.game.image.thumb_url !== '/images/cover_board.svg' && this.game.image.thumb_url !== '/images/cover_video.svg') return true;
  }
});
Template.gameSuggest.events({
  'click .game-suggest-pick': function(e, tpl) {
    var title = this.game.name;
    var category = this.game.category;
    var cover = this.game.image.thumb_url;
    var tags = [];
    if(this.game.platforms) {
      for(tag in this.game.platforms) {
        tags.push(this.game.platforms[tag].abbreviation);
      }
    }
    var newGame = Games.insert({
      title : title,
      cover : cover,
      category : category,
      tags : tags
    }, function(error, result) {
      var newGamesession = Session.get('newGamesession');
      if(!error) {
        newGamesession.games.push(Games.findOne(result))
      } else {
        var alreadyExists = Games.findOne({title: title});
        if(alreadyExists) newGamesession.games.push(alreadyExists);
      }
      Session.set('suggests', null);
      Session.set('newGamesession', newGamesession);
    });
  }
});
Template.gameSuggest.onCreated(function () {
  var index = this.data.index;
  var game = this.data.game;
  if(!game.image && game.id && this.data.game.category === 'boardgame'){
    Meteor.call("getBoardGameImageById", game.id, function(error, result) {
      if (!error && result.data) {
        var suggests = Session.get('suggests');
        if(!result.data.image) {
          suggests[index].image = {thumb_url: '/images/cover_board.svg'};
        } else {
          suggests[index].image = {thumb_url: 'https:'+result.data.thumbnail};
        }
        Session.set('suggests', suggests);
      } else {
        return false;
      }
    });
  } else if(!game.image && this.data.game.category === 'videogame'){
    var suggests = Session.get('suggests');
    suggests[index].image = {thumb_url: '/images/cover_video.svg'};
    Session.set('suggests', suggests);
  }
});
