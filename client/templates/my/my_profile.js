Template.myProfile.helpers({
  currentUserName: function(){
    var currentUser = Meteor.user();
    if(currentUser) return getName(currentUser);
  },
  hasNoEmail: function(){
    if(Meteor.user().emails) {
      return !(Meteor.user().emails[0])
    } else {
      return false
    }
  },
  userSchema: function() {
    return Schema.user;
  },
  myProfileTabs: function() {
    // Every tab object MUST have a name and a slug!
    return [
      { name: TAPi18n.__('myProfile'), slug: 'profile' },
      { name: TAPi18n.__('myProfileMessages'), slug: 'messages' },
      { name: TAPi18n.__('myProfileParties'), slug: 'parties' }
      // { name: TAPi18n.__('myProfileGames'), slug: 'games'}
    ];
  },
  activeTab: function() {
    return Session.get('activeTab');
  },
  'playerData': function(){
    var member = Meteor.users.findOne(this.userId);
    member.status = this.status;
    member.messages = this.messages;
    return member;
  },
  'playerName': function() {
    return getName(this);
  },
  playersByStatus: function() {
    return groupPlayersByStatus(Meteor.user().group);
  },
  myGamesessions: function() {
    var myGamesessions = Meteor.user().profile.gamesessions;
    if(myGamesessions) {
      if(myGamesessions.length > 0) {
        Tracker.autorun(function() {
          Meteor.subscribe('gamesessions',
            {'_id': {'$in': myGamesessions}}
          );
        });
        return Gamesessions.find({'_id': {'$in': myGamesessions}}, {sort: {meetingDate: -1}}) || {};
      } else {
        return false
      }
    }
  },
  beforeRemove: function () {
    return function (collection, id) {
      if (confirm(TAPi18n.__('myProfileRemoveConfirm'))) {
        try {
          Meteor.call('userRemoveProfile', Meteor.userId());
        } catch(error) {
          return throwNotification(error);
        } finally {
          FlowRouter.go('home');
        }
      }
    };
  },
  'lastMessageFromPlayer': function() {
    var groupByPlayer = _.groupBy(Meteor.user().messages, function(msg){
      return msg.playerId;
    });
    var rGroupByPlayer = [];
    for(playerId in groupByPlayer){
      rGroupByPlayer.push({
        player: Meteor.users.findOne(playerId),
        lastMessage: groupByPlayer[playerId][groupByPlayer[playerId].length - 1]
      })
    }
    return rGroupByPlayer;
  },
  selectYears: function() {
    var options = [];
    var year = moment().year();
    year5 = Math.ceil(year/5)*5;
    for (var i = year5; i > 1930; i -= 5) {
      options.push({label: i.toString(), value: i});
    }
    return options;
  }
});

Template.myProfile.events({
  'click .nav-tabs-item': function(e) {
    var tab = $(e.currentTarget).data('tab');
    var hash = (window.location.hash)? window.location.hash.substr(1) : false;
    if(!hash && hash !== tab) {
      Session.set('activeTab', tab);
    }
  },
  'click .player-item.is-message': function(e) {
    var playerId = this._id;
    FlowRouter.go('/messages/'+playerId);
  }
});

Template.myProfile.rendered = function() {
  if(window.location.hash) {
    var hash = window.location.hash.substr(1);
    // if(hash === "unsubscribe"){
    //   console.log($('input[name="emailCheck"]'));
    //   $('input[name="emailCheck"]').attr('checked', false);
    //   // AutoForm.validateField('userEditProfile', 'emailCheck', false);
    // } else {
      Session.set('activeTab', hash);
    // }
  }
};

Template.myProfile.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var messages = Meteor.user().messages;
    if(messages){
      var playersInMyGroup = messages.map(function(msg,index){
        return msg.playerId;
      });
      self.subscribe('somePlayers', {
        '_id': {'$in': playersInMyGroup}
      },{
        fields: {
          username: 1,
          'profile': 1
        }
      });
    }
  });
});

AutoForm.hooks({
  userEditProfile: {
    before: {
      update: function(doc) {

        // Change email: verified
        var email = doc.$set['emails'];
        if(email) {
          if(email[0].address.length > 0) {
            email[0].verified = true;
            doc.$set['emails'] = email;
          }
        }

        return doc;
      }
    },
    onSuccess: function(formType, result) {
      var profile = Meteor.user().profile;
      if(profile.address) {
        var newLocation = (profile.address.street)? profile.address.street + ' ' : '';
        newLocation += (profile.address.zipCode)? profile.address.zipCode + ' ' : '';
        newLocation += (profile.address.city)? profile.address.city : '';
        Meteor.call('geoLocalizePlace', newLocation, function (error, result) {
          if(!error && result) {
            profile.location.coordinates = result;
            Meteor.call("userEditProfile", profile);
          } else {
            console.log(error);
          }
        });
      }
    }
  }
});

ReactiveTabs.createInterface({
  template: 'navTabs'
});
