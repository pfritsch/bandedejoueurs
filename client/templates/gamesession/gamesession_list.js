Session.setDefault('gamesessionsFilter', {});

Template.gamesessionList.helpers({
  gamesessionsByDay: function() {
    var sessions = Gamesessions.find(getGamesessionsFilter(), {
      sort: {meetingDate: 1}
    }).fetch();
    return groupGamesessionsByDate(sessions);
  },
  gamesTitleOptions: function() {
    var sessions = Gamesessions.find({},{
      sort: {meetingDate: 1}
    }).fetch();
    var allGames = [];
    sessions.map(function(item) {
      var group = item.games;
      if(group.length > 0) {
        group.map(function(item) {
          if(allGames.contains('value', item.gameId) < 0) {
            allGames.push({label: item.title, value: item.gameId});
          }
        });
      }
    });
    return allGames;
  },
  gamesTitlePlaceholder: function() {
    return TAPi18n.__('schemas.gamesession.games.$.title.placeholder')
  },
  meetingTypeIsIRL: function() {
    var type = Session.get('gamesessionsFilter').meetingType;
    if(type) return type.indexOf('irl') > -1
  },
  meetingTypeIsOnline: function() {
    var type = Session.get('gamesessionsFilter').meetingType;
    if(type) return type.indexOf('online') > -1
  },
  meetingTypeIRLOption: function() {
    var sessions = Gamesessions.find({meetingType: "irl"},{
      sort: {meetingDate: 1}
    }).fetch();
    var allCities = [];
    sessions.map(function(item) {
      var address = item.meetingPlace.address;
      if(address && allCities.indexOf(address.city) < 0) allCities.push(address.city);
    });
    return allCities.map(function(city) {
      return city = {label: city, value: city}
    });
  },
  meetingTypeOnlineOption: function() {
    var sessions = Gamesessions.find({meetingType: "online"},{
      sort: {meetingDate: 1}
    }).fetch();
    var allServices = [];
    sessions.map(function(item) {
      var service = item.meetingPlace.service;
      if(service && allServices.indexOf(service.title) < 0) allServices.push(service.title);
    });
    return allServices.map(function(service) {
      return service = {
        label: TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.'+service),
        value: service
      }
    });
  },
  meetingPlaceIRLPlaceholder: function() {
    return TAPi18n.__('gamesessionFilterWhereIRL')
  },
  meetingPlaceOnlinePlaceholder: function() {
    return TAPi18n.__('gamesessionFilterWhereOnline')
  },
});

Template.gamesessionList.events({
  'change [name="meetingType"]': function (e) {
    var currentFilter = Session.get('gamesessionsFilter');
    var allVals = [];
    $('[name="meetingType"]:checked').each(function() {
      allVals.push($(this).val());
    });
    if(allVals.length > 0) {
      currentFilter.meetingType = allVals;
    } else {
      delete currentFilter.meetingType;
    }
    Session.set('gamesessionsFilter', currentFilter);
  },
  'change [name="meetingPlaceIRL"]': function (e) {
    var currentFilter = Session.get('gamesessionsFilter');
    if($(e.target).val().length > 0) {
      currentFilter.meetingPlace = $(e.target).val();
    } else {
      delete currentFilter.meetingPlace;
    }
    Session.set('gamesessionsFilter', currentFilter);
  },
  'change [name="meetingPlaceOnline"]': function (e) {
    var currentFilter = Session.get('gamesessionsFilter');
    if($(e.target).val().length > 0) {
      currentFilter.meetingPlaceOnline = $(e.target).val();
    } else {
      delete currentFilter.meetingPlaceOnline;
    }
    Session.set('gamesessionsFilter', currentFilter);
  },
  'change [name="gameTitle"]': function (e) {
    var currentFilter = Session.get('gamesessionsFilter');
    if($(e.target).val().length > 0) {
      currentFilter.gameId = $(e.target).val();
    } else {
      delete currentFilter.gameId;
    }
    Session.set('gamesessionsFilter', currentFilter);
  }
});

Template.gamesessionList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var filter = {
      meetingDate: {$gte: moment().subtract(6, 'h').unix()}
    };
    var option = {
      sort: { meetingDate: 1 },
      limit: 0
    };
    self.subscribe('gamesessions', filter, option);

    SEO.set({
      title: 'Bande de joueurs | '+TAPi18n.__('gamesessionDetailallSessions')
    });
  });
});
