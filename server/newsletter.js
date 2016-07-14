SyncedCron.add({
  name: 'Send news',
  schedule: function(parser) {
    // return parser.text('every 30 secs');
    return parser.text('at 16:00'); // Every day at 18:00 (Timezone)
  },
  job: function() {

    var weekly = false;
    var todayNumber = moment().isoWeekday();

    if(todayNumber < 7){

      // Daily News
      var gamesessions = Gamesessions.find({
        meetingDate: {
          $gte: moment().unix(),
          $lt: moment().add(48, 'h').unix()
        },
        emailSent: {
          $in: [null, false]
        }
      },{
        sort: {
          meetingDate: 1
        }
      }).fetch();

      var newPlayers = [];

    } else if(todayNumber === 7) {

      weekly = true;

      // Weekly News
      var gamesessions = Gamesessions.find({
        meetingDate: {
          $gte: moment().unix(),
          $lt: moment().add(7, 'd').unix()
        },
        emailSent: {
          $in: [null, false]
        }
      },{
        sort: {
          meetingDate: 1
        }
      }).fetch();

      var now = moment();
      var lastWeek = moment().subtract(7, 'd').format();
      var newPlayers = Meteor.users.find({
        createdAt: {
          $gte: new Date(lastWeek)
        }
      }).fetch();
    }

    try {
      Meteor.call('sendNews', gamesessions, newPlayers, weekly);
    } catch (e) {
      console.log(e);
    }
  }
});
SyncedCron.start();
