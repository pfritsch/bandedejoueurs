Template.home.helpers({
  currentUserName: function(){
    var currentUser = Meteor.user();
    if(currentUser) return getName(currentUser);
  }
});