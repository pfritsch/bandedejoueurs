SyncedCron.add({
  name: 'Send news',
  schedule: function(parser) {
    // return parser.text('every 30 secs');
    return parser.text('at 18:00'); // Every day at 18:00
  },
  job: function() {
    Meteor.call('sendNews');
  }
});

SyncedCron.start();
