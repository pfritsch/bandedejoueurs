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

Template.playerAction.events({
  'click .player-invite': function(e){
    e.preventDefault();
    if(!Meteor.user()) {
      return throwNotification(TAPi18n.__('errorNotUser'));
    } else {
      Meteor.call('userInvitePlayer', this._id);
    }
  },
  'click .player-cancel': function(e){
    e.preventDefault();
    if(!Meteor.user()) {
      return throwNotification(TAPi18n.__('errorNotUser'));
    } else {
      Meteor.call('cancelInvitation', this._id);
    }
  },
  'click .player-accept': function(e){
    e.preventDefault();
    if(!Meteor.user()) {
      return throwNotification(TAPi18n.__('errorNotUser'));
    } else {
      Meteor.call('acceptInvitation', this._id);
    }
  },
  'click .player-decline': function(e){
    e.preventDefault();
    if(!Meteor.user()) {
      return throwNotification(TAPi18n.__('errorNotUser'));
    } else {
      Meteor.call('declineInvitation', this._id);
    }
  },
  // TODO: contact player?
  // 'click .player-contact': function(e){
  //   e.preventDefault();
  //   FlowRouter.go("playerDetail", {userId: this._id}, {invite: true});
  // }
});
