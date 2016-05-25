Template.myPreview.helpers({
  currentUser:function() {
    return Meteor.user();
  },
  hasNoEmail: function(){
    if(Meteor.user().emails) {
      return !(Meteor.user().emails[0])
    } else {
      return false
    }
  },
  currentUserName: function(){
    var currentUser = Meteor.user();
    if(currentUser) return getName(currentUser);
  },
  hasNewMessage: function(){
    var messages = Meteor.user().messages;
    if(messages) {
      return messages.contains("status", "new") > -1;
    }
  }
});

Template.myPreview.events({
  'click .my-preview-logout': function(e) {
    e.preventDefault();
    AccountsTemplates.logout();
  }
});

Template.myPreview.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('currentUserData');
  });
});
