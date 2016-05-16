Template.playerBand.helpers({
  'playerName': function() {
    return getName(this);
  },
  'status': function() {
    switch (this.status) {
      case 'pendingInvitation':
        return {pendingInvitation: true}
      break;
      case 'invited':
        return {invited: true}
      break;
      case 'accepted':
        return {accepted: true}
      break;
      default:
        return false
    }
  },
});

Template.playerBand.events({
  'click .acceptInvitation': function(e){
    e.preventDefault();
    Meteor.call("acceptInvitation", this._id, function(error, result){
      if(error){
        console.log("error", error);
      }
    });
  },
  'click .declineInvitation': function(e){
    e.preventDefault();
    Meteor.call("declineInvitation", this._id, function(error, result){
      if(error){
        console.log("error", error);
      }
    });
  },
  'click .cancelInvitation': function(e){
    e.preventDefault();
    Meteor.call("cancelInvitation", this._id, function(error, result){
      if(error){
        console.log("error", error);
      }
    });
  }
});
