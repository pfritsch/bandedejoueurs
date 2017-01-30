// Template.unsubscribe.events({
//   'click .unsubscribe-me': function(e) {
//     e.preventDefault();
//   }
// });
//
Template.unsubscribe.onCreated(function() {
  let userId = FlowRouter.getParam('userId');
  Meteor.call("userUnsubscribe", userId);
});
