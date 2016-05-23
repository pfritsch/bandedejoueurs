Template.myProfile.helpers({
  currentUserName: function(){
    var currentUser = Meteor.user();
    if(currentUser.profile && currentUser.profile.name) return currentUser.profile.name;
    return currentUser.username;
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
      { name: TAPi18n.__('myProfileBand'), slug: 'band' },
      { name: TAPi18n.__('myProfileParties'), slug: 'parties' },
      // { name: TAPi18n.__('myProfileGames'), slug: 'games'}
    ];
  },
  activeTab: function() {
    return Session.get('activeTab');
  },
  birthdayValue: function() {
    var birthday = Meteor.user().profile.birthday;
    if(birthday) {
      return moment(birthday, "X").format('DD/MM/YYYY');
    }
  },
  playerData: function(){
    var member = Meteor.users.findOne(this.userId);
    member.status = this.status;
    member.messages = this.messages;
    return member;
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
  }
});

Template.myProfile.events({
  'click .nav-tabs-item': function(e) {
    var tab = $(e.currentTarget).data('tab');
    var hash = (window.location.hash)? window.location.hash.substr(1) : false;
    if(!hash && hash !== tab) {
      Session.set('activeTab', tab);
    }
  }
});

Template.myProfile.rendered = function() {
  var self = this;
  Tracker.autorun(function () {
    var lang = Session.get('lang');
    self.$('[name="profile.birthday"]').datetimepicker({
      format: 'DD/MM/YYYY',
      timepicker:false,
      formatDate: 'DD/MM/YYYY',
      dayOfWeekStart: 1,
      lang: lang
    });
  });
  if(window.location.hash) {
    Session.set('activeTab', window.location.hash.substr(1));
  }
};

Template.myProfile.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var myGroup = Meteor.user().group;
    if(myGroup){
      var playersInMyGroup = myGroup.map(function(player,index){
        return player.userId;
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
        // Format the date time
        var birthday = doc.$set['profile.birthday'];
        if(birthday) {
          birthday = moment(birthday, "DD/MM/YYYY");
          doc.$set['profile.birthday'] = moment(birthday).unix();
        }

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
  template: 'navTabs',
  onChange: function (slug, template) {
    // console.log('[tabs] Tab has changed! Current tab:', slug);
  }
});
