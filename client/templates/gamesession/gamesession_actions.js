Template.gamesessionActions.helpers({
  isAuthor: function() {
    return this.authorId === Meteor.userId();
  },
  isRegistered: function() {
    if(this.players) return this.players.indexOf(Meteor.userId()) >= 0;
  },
  isFull: function() {
    if(this.spots) return (this.spots - this.players.length) <= 0;
  }
});

Template.gamesessionActions.events({
  'click .gamesession-join': function (e) {
    e.preventDefault();
    if(checkUser() && this.players.indexOf(Meteor.userId()) < 0) {
      Meteor.call('joinGamesession', this._id);
      FlowRouter.go('gamesessionDetail', {gamesessionId: this._id});
    }
  },
  'click .gamesession-leave': function (e) {
    e.preventDefault();
    if(Meteor.user() && this.players.indexOf(Meteor.userId()) >= 0) {
      Meteor.call('leaveGamesession', this._id);
    }
  }
});
