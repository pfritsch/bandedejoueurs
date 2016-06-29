Meteor.methods({
  sendUserEmail: function (emailData) {
    this.unblock();

    user = Meteor.user();
    check(user, Object);
    check(user.emails[0], {
      address: String,
      verified: Boolean
    });

    SSR.compileTemplate( 'htmlEmail', Assets.getText( emailData.template+'.html' ));

    Email.send({
      to: user.emails[0].address,
      from: process.env.MAIL_FROM,
      subject: emailData.subject,
      html: SSR.render( 'htmlEmail', emailData )
    });
    console.log("Mail sent to: " + user.emails[0].address)
  },
  sendPlayerEmail: function (emailData, playerId) {
    this.unblock();

    user = Meteor.user();
    check(user, Object);
    var player = Meteor.users.findOne(playerId);
    check(player, Object);
    check(player.emails[0], {
      address: String,
      verified: Boolean
    });
    check(player.emailCheck, true);

    SSR.compileTemplate( 'htmlEmail', Assets.getText( emailData.template+'.html' ));

    Email.send({
      to: player.emails[0].address,
      from: process.env.MAIL_FROM,
      subject: emailData.subject,
      html: SSR.render( 'htmlEmail', emailData )
    });
    console.log("Mail sent to: " + player.emails[0].address)
  },
  sendNews: function () {
    this.unblock();

    var players = Meteor.users.find({'emailCheck': true, emails: { $exists: true }});
    var todayNumber = moment().isoWeekday();
    var title = 'emailNewsTitle';

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


    if (gamesessions.length > 0) {

      players.forEach(function(player){

        var lang = player.lang;
        moment.locale(lang);

        var gamesessionsFormated = gamesessions.map(function(gamesession){
          gamesession.dateFormated = moment(gamesession.meetingDate, 'X').add(2, 'h').calendar();
          gamesession.organisedBy = TAPi18n.__('gamesessionOrganizedBy', {name: gamesession.authorName}, lang);
          return gamesession;
        });

        var emailData = {
          template: 'email_news',
          absoluteUrl: Meteor.absoluteUrl('', {secure: true}),
          subject: TAPi18n.__('emailNewsSubject', {}, lang),
          titleNewSessions: TAPi18n.__(title, {}, lang),
          gamesessions: gamesessionsFormated,
          callToActionUrl: FlowRouter.url('gamesessionList'),
          callToAction: TAPi18n.__('emailNewsCTA', {}, lang),
          ciao: TAPi18n.__('emailCiao', {}, lang),
          followUs: TAPi18n.__('emailFollowUs', {}, lang),
          feedback: TAPi18n.__('emailFeedback', {}, lang)
        };

        SSR.compileTemplate( 'htmlEmail', Assets.getText( emailData.template+'.html' ));

        Email.send({
          to: player.emails[0].address,
          from: process.env.MAIL_FROM,
          subject: emailData.subject,
          html: SSR.render( 'htmlEmail', emailData )
        });
        console.log("Mail sent to: " + player.emails[0].address + " in "+lang)

      });

      gamesessions.forEach(function(gamesession){
        Gamesessions.update(gamesession._id, {
          $set : {emailSent : true}
        });
      });
    }
  }
});
