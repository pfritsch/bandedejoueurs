SyncedCron.add({
  name: 'Send news',
  schedule: function(parser) {
    // return parser.text('every 30 seconds');
    return parser.text('at 16:00'); // Every day at 18:00 (Timezone)
  },
  job: function() {

    var weekly = false;
    var todayNumber = moment().isoWeekday();
    var gamesessions = [];
    var newPlayers = [];

    if(todayNumber === 7) {

      console.log("Weekly Newsletter");

      weekly = true;

      // Weekly News
      gamesessions = Gamesessions.find({
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
      newPlayers = Meteor.users.find({
        createdAt: {
          $gte: new Date(lastWeek)
        }
      }).fetch();

    } else {

      console.log("Daily Newsletter");

      // Daily News
      gamesessions = Gamesessions.find({
        meetingDate: {
          $gte: moment().unix(),
          $lt: moment().add(60, 'h').unix()
        },
        emailSent: {
          $in: [null, false]
        }
      },{
        sort: {
          meetingDate: 1
        }
      }).fetch();

    }
    console.log("New players: "+newPlayers.length);
    console.log("Gamesessions: "+gamesessions.length);

    if (gamesessions.length > 0 || newPlayers.length > 0) {
      try {
        Meteor.call('sendNews', gamesessions, newPlayers, weekly);
      } catch (e) {
        console.log(e);
      }
    }
  }
});
SyncedCron.start();
