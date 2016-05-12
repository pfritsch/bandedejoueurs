Template.playerAction.helpers({
  'inMyGroup': function() {
    if(Meteor.user()) {
      var myGroup = Meteor.user().group;
      if(myGroup) {
        return myGroup.contains(this._id, 'userId') > -1;
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
      Meteor.call('userInvitePlayer', this._id);
    }
  }
  // TODO: contact player?
  // 'click .player-contact': function(e){
  //   e.preventDefault();
  //   FlowRouter.go("playerDetail", {userId: this._id}, {invite: true});
  // }
});
