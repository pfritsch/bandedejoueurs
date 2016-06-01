SyncedCron.add({
  name: 'Send news',
  schedule: function(parser) {
    // return parser.text('every 30 secs');
    // return parser.text('on Monday at 10:00 am every week');
    return parser.text('at 8:00 am');
  },
  job: function() {
    Meteor.call('sendNews');
  }
});

SyncedCron.start();
