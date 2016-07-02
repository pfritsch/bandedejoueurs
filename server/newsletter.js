SyncedCron.add({
  name: 'Send news',
  schedule: function(parser) {
    // return parser.text('every 30 secs');
    return parser.text('at 16:00'); // Every day at 18:00 (Timezone)
  },
  job: function() {

    var title = 'emailNewsTitle';
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
      title = 'emailNewsTitleDaily';

    } else if(todayNumber === 7) {

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

    }

    try {
      Meteor.call('sendNews', gamesessions, title);
    } catch (e) {
      console.log(e);
    }
  }
});
SyncedCron.start();
