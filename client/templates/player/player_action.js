Template.playerAction.helpers({
  'inMyGroup': function() {
    if(Meteor.user()) {
      var myGroup = Meteor.user().group;
      if(myGroup) {
        var userId = this._id;
        var playerPosition = myGroup.contains(userId, 'userId');
        console.log(playerPosition)
        // _.find(myGroup, function(item) {
        //   return item.userId == userId
        // })
      //   console.log(this._id)
      //   if(playerPosition > -1) {
      //     this.status = myGroup[playerPosition].status;
      //     return this;
      //   }
      }
    }
  },
  'itsMe': function() {
    if(Meteor.user()) {
      return this._id === Meteor.userId();
    }
  },
  'status': function() {
    return getPlayerStatus(this.status);
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
