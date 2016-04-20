Notifications = new Mongo.Collection(null);

throwNotification = function(message) {
  Notifications.insert({message: message});
};

Template.notificationList.helpers({
  notifications: function() {
    return Notifications.find();
  }
});

Template.notification.onRendered(function() {
  var notification = this.data;
  Meteor.setTimeout(function () {
    Notifications.remove(notification._id);
  }, 3800);
});
