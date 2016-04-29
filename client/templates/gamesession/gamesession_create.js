Session.setDefault('newGamesession', {
  meetingType: 'irl',
  category: '',
  games: []
});

Template.gamesessionCreate.helpers({
  gamesessionSchema: function() {
    return Schema.gamesession;
  },
  meetingDateValue: function() {
    var now = moment().roundNext15Min();
    return moment(now).format('DD/MM/YYYY HH:mm');
  },
  meetingPlaceValue: function() {
    var form = Session.get('newGamesession');
    if(form.meetingType === "irl" && Meteor.user().profile.address) return Meteor.user().profile.address;
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
    } else {
      $('[name="meetingType"]').filter('[value=irl]').prop('checked', true);
    }
    return isIrl;
  },
  games: function (){
    return Session.get('newGamesession').games;
  },
  gamesTitleParams: function() {
    return {
      category: Session.get('newGamesession').category
    }
  },
  gamesTitlePlaceholder: function() {
    return TAPi18n.__('schemas.gamesession.games.$.title.placeholder')
  },
  gamesSuggests: function() {
    return Session.get('suggests');
  }
});


Template.gamesessionCreate.events({
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
  var self = this;
  self.autorun(function() {
    self.subscribe('someGames', {});
  });
});

Template.gamesessionCreate.rendered = function() {
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
  Session.set('newGamesession', {
    meetingType: 'irl',
    category: '',
    games: []
  });
  Session.set('suggests', null);
  $('[name="meetingType"]').filter('[value=irl]').prop('checked', true);
};

AutoForm.hooks({
  gamesessionInsert: {
    before: {
      insert: function(doc) {
        form = Session.get('newGamesession');

        // Add Author
        doc.authorId = Meteor.userId();

        // Add Author as player
        doc.players = [Meteor.userId()];

        // Format the date time
        var meetingDate = moment(doc.meetingDate, "DD/MM/YYYY HH:mm");
        doc.meetingDate = moment(meetingDate).unix();

        // Choose a cover
        var newCover = (form.category === 'videogame')? '/images/cover_video.svg' : '/images/cover_board.svg';
        if(form.games && form.games.length > 0) newCover = form.games[0].cover;
        doc.cover = newCover;

        // Generate a title
        var newTitle = { what: TAPi18n.__('gamesessionCreateGames'), where: ''};
        // Where
        if(doc.meetingPlace) {
          if(doc.meetingType === 'irl') {
            if(doc.meetingPlace.address.city) {
              newTitle.where = TAPi18n.__('helper.inCity', doc.meetingPlace.address.city);
              if(doc.meetingPlace.address.zipCode) {
                newTitle.where += ' ('+doc.meetingPlace.address.zipCode+')';
              }
            } else if(doc.meetingPlace.address.zipCode) {
              newTitle.where = TAPi18n.__('helper.inZipCode', doc.meetingPlace.address.zipCode);
            }
          } else {
            if(doc.meetingPlace.service.title != 'other') {
              var key = TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.'+doc.meetingPlace.service.title);
              newTitle.where = TAPi18n.__('helper.onPlatform', key);
            }
          }
        }
        // What
        if(form.category === 'boardgame') {
          newTitle.what = TAPi18n.__('gamesessionCreateBoardGames');
          if(form.games.length === 1) newTitle.what = form.games[0].title;
        } else if(form.category === 'videogame') {
          newTitle.what = TAPi18n.__('gamesessionCreateVideoGames');
          if(form.games.length === 1) newTitle.what = form.games[0].title;
        }
        doc.title = newTitle.what + ' ' + newTitle.where;

        // Add games
        doc.games = form.games.map(function(item,index){
          item.gameId = item._id;
          return item;
        });
        return doc;
      }
    },
    onSuccess: function(t, result) {

      var emailData = {
        template: 'email_gamesession_confirm',
        subject: TAPi18n.__('gamesessionPreviewTitle'),
        title: TAPi18n.__('emailCongrats', getName(Meteor.user())),
        subtitle: formatTitle(this.insertDoc)+' '+formatDate(this.insertDoc.meetingDate),
        text: TAPi18n.__('emailGamesessionSendLink'),
        url: Meteor.absoluteUrl()+'gamesessions/'+this.docId,
        rdv: TAPi18n.__('emailGamesessionRDV'),
        rdvDate: TAPi18n.__('helper.onDate', moment(this.insertDoc.meetingDate, 'X').format('LLLL')),
        rdvLocation: formatLocation(this.insertDoc.meetingPlace),
        callToActionUrl: Meteor.absoluteUrl()+'gamesessions/'+this.docId,
        callToAction: TAPi18n.__('gamesessionDetailSee'),
        ciao: TAPi18n.__('emailCiao'),
        followUs: TAPi18n.__('emailFollowUs'),
        feedback: TAPi18n.__('emailFeedback')
      };
      Meteor.call('sendUserEmail', emailData);

      // Add author to player list
      Meteor.call('joinGamesession', this.docId);

      // Redirect to confirmation page
      FlowRouter.go('gamesessionPreview', {gamesessionId: this.docId});
    },
    onError: function(formType, error) {
      return throwNotification(error.message);
    }
  }
});
