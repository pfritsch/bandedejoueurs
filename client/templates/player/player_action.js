Template.playerAction.helpers({
  'inMyGroup': function() {
    if(Meteor.user()) {
      var myGroup = Meteor.user().group;
      if(myGroup) {
        var userId = this._id;
        return _.find(myGroup, function(item) {
          if(item != null) return item.userId == userId
        })
      }
    }
  },
  'itsMe': function() {
    if(Meteor.user()) {
      return this._id === Meteor.userId();
    }
  },
  'playerStatus': function() {
    return getPlayerStatus(this.status);
  }
});
