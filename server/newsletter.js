SyncedCron.add({
  name: 'Send weekly newsletter',
  schedule: function(parser) {
    // return parser.text('every 30 secs');
    return parser.text('on Monday at 10:00 am every week');
  },
  job: function() {
    Meteor.call('sendNewsletter');
  }
});

SyncedCron.start();
