Template.myBand.helpers({
  // currentUserName: function(){
  //   var currentUser = Meteor.user();
  //   if(currentUser.profile && currentUser.profile.name) return currentUser.profile.name;
  //   return currentUser.username;
  // },
  // hasNoEmail: function(){
  //   if(Meteor.user().emails) {
  //     return !(Meteor.user().emails[0])
  //   } else {
  //     return false
  //   }
  // },
  // emailNotValidated: function() {
  //   if(Meteor.user().emails) {
  //     if(Meteor.user().emails[0]) return !(Meteor.user().emails[0].verified)
  //     return false
  //   } else {
  //     return false
  //   }
  // },
  // userSchema: function() {
  //   return Schema.user;
  // },
  // myProfileTabs: function() {
  //   // Every tab object MUST have a name and a slug!
  //   return [
  //     { name: TAPi18n.__('myProfileProfile'), slug: 'profile' },
  //     // { name: TAPi18n.__('myProfileBand'), slug: 'band' },
  //     // { name: TAPi18n.__('myProfileParties'), slug: 'parties' },
  //     { name: TAPi18n.__('myProfileNotifications'), slug: 'notifications' },
  //     { name: TAPi18n.__('helper.logout'), slug: 'logout', onRender: function() {
  //       AccountsTemplates.logout();
  //     }}
  //     // { name: TAPi18n.__('myProfileGames'), slug: 'games'}
  //   ];
  // },
  // activeTab: function() {
  //   return Session.get('activeTab');
  // },
  // birthdayValue: function() {
  //   var birthday = Meteor.user().profile.birthday;
  //   if(birthday) {
  //     return moment(birthday, "X").format('DD/MM/YYYY');
  //   }
  // },
  myGroup: function() {
    var myGroup = Meteor.user().profile.group;
    if(myGroup) {
      if(myGroup.length > 0) {
        Tracker.autorun(function() {
          Meteor.subscribe('somePlayers',
          {
            '_id': {'$in': myGroup}
          },{
            fields: {
              username: 1,
              'profile': 1
            }
          });
        });
        return Meteor.users.find({'_id': {'$in': myGroup}}, {}) || {};
      } else {
        return false
      }
    }
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
  // beforeRemove: function () {
  //   return function (collection, id) {
  //     if (confirm(TAPi18n.__('myProfileRemoveConfirm'))) {
  //       try {
  //         Meteor.call('userRemoveProfile', Meteor.userId());
  //       } catch(error) {
  //         return throwNotification(error);
  //       } finally {
  //         FlowRouter.go('home');
  //       }
  //     }
  //   };
  // }
});
