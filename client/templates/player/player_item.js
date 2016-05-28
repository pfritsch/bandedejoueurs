Template.playerItem.helpers({
  'playerName': function() {
    return getName(this);
  },
  'itsMe': function() {
    if(Meteor.user()) {
      return this._id === Meteor.userId();
    }
  },
  'isSelected': function() {
    var selectedUser = Session.get('selectedPlayer');
    return this._id === selectedUser;
  },
  'age': function() {
    if(this.profile.birthday) {
      var age = rangeAge(this.profile.birthday);
      return TAPi18n.__('playerAge', age);
    }
  }
});
