SyncedCron.add({
  name: 'Send weekly newsletter',
  schedule: function(parser) {
    // return parser.text('every 30 secs');
    return parser.text('at 08:00 every Monday');
  },
  job: function() {
    Meteor.call('sendNewsletter');
  }
});

SyncedCron.start();
