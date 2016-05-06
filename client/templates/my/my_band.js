Template.myBand.helpers({
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
  }
});
