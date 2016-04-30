Template.gamesessionEdit.helpers({
  gamesession: function() {
    var gamesessionId = FlowRouter.getParam('gamesessionId');
    var gamesession = Gamesessions.findOne(gamesessionId) || {};
    if(gamesession.boardgameTags) gamesession.category = 'boardgame';
    if(gamesession.videogameTags) gamesession.category = 'videogame';
    Session.set('newGamesession', gamesession);
    return gamesession;
  },
  meetingDateValue: function() {
    var date = moment(this.meetingDate, 'X');
    return moment(date).format('DD/MM/YYYY HH:mm');
  },
  meetingTypeOptions: function() {
    var options = new Array(
        {label: TAPi18n.__('schemas.gamesession.meetingType.options.irl'), value: "irl"},
        {label: TAPi18n.__('schemas.gamesession.meetingType.options.online'), value: "online"}
      );
    return options;
  },
  meetingServiceOptions: function() {
    var options = new Array(
        {label: TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.other'), value: "other"},
        {label: TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.skype'), value: "skype"},
        {label: TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.steam'), value: "steam"},
        {label: TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.teamspeak'), value: "teamspeak"},
        {label: TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.psn'), value: "psn"},
        {label: TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.xlive'), value: "xlive"}
      );
    return options;
  },
  meetingTypeIsIRL: function() {
    var isIrl = (Session.get('newGamesession').meetingType === 'irl');
    if (!isIrl) {
      $('[name="meetingType"]').filter('[value=online]').prop('checked', true);
    } else if(Session.get('newGamesession').meetingType === 'online') {
      $('[name="meetingType"]').filter('[value=irl]').prop('checked', true);
    }
    return isIrl;
  },
  gamesTitlePlaceholder: function() {
    return TAPi18n.__('schemas.gamesession.games.$.title.placeholder')
  },
  newGames: function (){
    return Session.get('newGamesession').games;
  },
  gamesSuggests: function() {
    return Session.get('suggests');
  },
  beforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm(TAPi18n.__('gamesessionRemoveConfirm'))) {
        this.remove();
      }
    };
  },
  onRemoveSuccess: function () {
    return function (result) {
      FlowRouter.go('gamesessionList');
    };
  }
});


Template.gamesessionEdit.events({
  'change [name="meetingType"]:checked': function(e) {
    var form = Session.get('newGamesession');
    form.meetingType = $(e.target).val();
    Session.set('newGamesession', form);
  },
  'change [name="boardgameTags"]': function(e, tpl) {
    if($(e.target).is(":checked")) {
      var form = Session.get('newGamesession');
      form.category = 'boardgame';
      Session.set('newGamesession', form);
      tpl.$('[name="videogameTags"]').attr('checked', false);
    }
  },
  'change [name="videogameTags"]': function(e, tpl) {
    if($(e.target).is(":checked")) {
      var form = Session.get('newGamesession');
      form.category = 'videogame';
      Session.set('newGamesession', form);
      tpl.$('[name="boardgameTags"]').attr('checked', false);
    }
  },
  'change [name="games.$.title"]': function(e, tpl) {
    var value = $(e.target).val();
    var newGamesession = Session.get('newGamesession');
    if(value) {
      var newGame = Games.findOne(value);
      if(newGame) {
        if(!newGamesession.games) newGamesession.games = [];
        newGamesession.games.push(newGame);
        Session.set('newGamesession', newGamesession);
      } else {
        getGamesSuggestByTitle(value, newGamesession.category);
      }
    }
  },
  'click .game-remove': function(e, tpl) {
    var form = Session.get('newGamesession');
    form.games.contains('title', this.title);
    var index = form.games.contains('title', this.title);
    form.games.splice(index, 1);
    Session.set('newGamesession', form);
  },
  'click [data-toggle="boardgameTags"]': function(e, tpl) {
    e.preventDefault();
    var showGame = Session.get('showGame');
    showGame.boardgameTags ++;
    if(showGame.boardgameTags > 1) showGame.boardgameTags = 0;
    Session.set('showGame', showGame);
  },
  'click [data-toggle="videogameTags"]': function(e, tpl) {
    e.preventDefault();
    var showGame = Session.get('showGame');
    showGame.videogameTags ++;
    if(showGame.videogameTags > 1) showGame.videogameTags = 0;
    Session.set('showGame', showGame);
  }
});

Template.gamesessionCreate.onCreated(function() {
  Tracker.autorun(function() {
    Meteor.subscribe('someGames', {});
  });
});

Template.gamesessionEdit.rendered = function() {
  var self = this;
  Tracker.autorun(function () {
    var lang = Session.get('lang');
    self.$('.datetimepicker').datetimepicker({
      format: 'DD/MM/YYYY HH:mm',
      formatDate: 'DD/MM/YYYY',
      formatTime: 'HH:mm',
      minDate: 0,
      step: 15,
      use24hours: true,
      pick12HourFormat: false,
      dayOfWeekStart: 1,
      lang: lang
    });
  });

  Session.set('suggests', null);
};

AutoForm.hooks({
  gamesessionUpdate: {
    before: {
      update: function(doc) {
        form = Session.get('newGamesession');

        // Format the date time
        var meetingDate = moment(doc.$set.meetingDate, "DD/MM/YYYY HH:mm");
        doc.$set.meetingDate = moment(meetingDate).unix();

        // Choose a cover
        var newCover = (form.category === 'videogame')? '/images/cover_video.svg' : '/images/cover_board.svg';
        if(form.games && form.games.length > 0) newCover = form.games[0].cover;
        doc.$set.cover = newCover;

        // Generate a title
        var newTitle = { what: TAPi18n.__('gamesessionCreateGames'), where: ''};
        // Where
        if(doc.$set.meetingType) {
          if(doc.$set.meetingType === 'irl') {
            if(doc.$set['meetingPlace.address.city']) {
              newTitle.where = TAPi18n.__('helper.inCity', doc.$set['meetingPlace.address.city']);
              if(doc.$set['meetingPlace.address.zipCode']) {
                newTitle.where += ' ('+doc.$set['meetingPlace.address.zipCode']+')';
              }
            } else if(doc.$set['meetingPlace.address.zipCode']) {
              newTitle.where = TAPi18n.__('helper.inZipCode', doc.$set['meetingPlace.address.zipCode']);
            }
          } else if (doc.$set.meetingType === 'online') {
            if(doc.$set['meetingPlace.service.title'] != 'other') {
              var key = TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.'+doc.$set['meetingPlace.service.title']);
              newTitle.where = TAPi18n.__('helper.onPlatform', key);
            }
          }
        }
        // What
        if(form.category === 'boardgame') {
          newTitle.what = TAPi18n.__('gamesessionCreateBoardGames');
        } else if(form.category === 'videogame') {
          newTitle.what = TAPi18n.__('gamesessionCreateVideoGames');
          if(form.games.length > 0) newTitle.what = form.games[0].title;
        }
        doc.$set.title = newTitle.what + ' ' + newTitle.where;

        // Add games
        doc.$set.games = form.games.map(function(item,index){
          if(!item.gameId) item.gameId = item._id;
          return item;
        });

        delete doc.$set['games.$.title'];
        delete doc.$unset['games.$'];

        return doc;
      }
    },
    onSuccess: function(t, result) {
      FlowRouter.go('gamesessionList');
    },
    onError: function(formType, error) {
      console.log(error);
    }
  }
});
