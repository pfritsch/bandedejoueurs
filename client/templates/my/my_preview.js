Template.myPreview.helpers({
  currentUser:function() {
    return Meteor.user();
  },
  currentEmail: function() {
    var currentUser = Meteor.user();
    if(currentUser) {
      var email = _.first(currentUser.emails);
      return currentUser && email.address;
    }
  },
  currentUserName: function(){
    var currentUser = Meteor.user();
    if(currentUser) return getName(currentUser);
  }
});

Template.myPreview.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('currentUserData');
  });
});
