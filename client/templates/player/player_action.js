Template.playerAction.helpers({
  'inMyGroup': function() {
    if(Meteor.user()) {
      var myGroup = Meteor.user().profile.group;
      if(myGroup) {
        return myGroup.indexOf(this._id) > -1;
      }
    }
  },
  'itsMe': function() {
    if(Meteor.user()) {
      return this._id === Meteor.userId();
    }
  }
});

Template.playerAction.events({
  'click .player-invite': function(e){
    e.preventDefault();
    if(!Meteor.user()) {
      return throwNotification(TAPi18n.__('errorNotUser'));
    } else {
      Meteor.call('userAddPlayer', this._id);
    }
  }
  // TODO: contact player?
  // 'click .player-contact': function(e){
  //   e.preventDefault();
  //   FlowRouter.go("playerDetail", {userId: this._id}, {invite: true});
  // }
});
