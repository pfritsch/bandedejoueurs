Template.playerDetail.helpers({
  player: function() {
    var userId = FlowRouter.getParam('userId');
    var player = Meteor.users.findOne(userId) || {};
    return player;
  },
  'playerName': function() {
    if(this.profile && this.profile.name ) return this.profile.name +' <em>alias</em> '+this.username;
    return this.username;
  },
  'playerInfos': function() {
    if(this.profile) {
      var profileInfos = "";

      if(this.profile.address && this.profile.address.city) {
        profileInfos += this.profile.address.city;
      }

      var gender = (this.profile.gender)? this.profile.gender : false;
      profileInfos += (gender)? ', '+gender : '';

      if(this.profile.birthday) {
        var birthday = moment(this.profile.birthday, 'X');
        var age = rangeAge(moment().diff(birthday, 'years'));
        profileInfos += ', '+TAPi18n.__('playerAge', age);
      }

      return (profileInfos != "")? profileInfos : TAPi18n.__('playerDetailNone');
    }
  },
  'itsMe': function() {
    if(Meteor.user()) {
      return this._id === Meteor.userId();
    }
  },
  myGamesessions: function() {
    var myGamesessions = this.profile.gamesessions;
    if(myGamesessions && myGamesessions.length > 0) {
      Tracker.autorun(function() {
        Meteor.subscribe('gamesessions', {
          '_id': {'$in': myGamesessions},
          meetingDate: {$gte: moment().subtract(6, 'h').unix()}
        });
      });
      var nextGamesessions = Gamesessions.find({
        '_id': {'$in': myGamesessions}
      }, {
        sort: {meetingDate: 1}
      })
      return {count: nextGamesessions.fetch().length, sessions: nextGamesessions} || {};
    } else {
      return false
    }
  }
});

Template.playerDetail.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var userId = FlowRouter.getParam('userId');
    self.subscribe('somePlayers', { _id: userId });
  });
});
