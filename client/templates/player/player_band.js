Template.playerBand.helpers({
  'playerName': function() {
    return getName(this);
  },
  'status': function() {
    return getPlayerStatus(this.status);
  }
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
