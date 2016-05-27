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
  sendNewsletter: function () {
    this.unblock();

    var gamesessions = Gamesessions.find({
      meetingDate: {
        $gte: moment().unix(),
        $lt: moment().add(7, 'd').unix()
      }
    },{
      sort: {meetingDate: 1}
    }).fetch();

    var players = Meteor.users.find({'emailCheck': true});

    players.forEach(function(player){

      var lang = player.lang;
      moment.locale(lang);

      var gamesessionsFormated = gamesessions.map(function(gamesession){
        gamesession.dateFormated = moment(gamesession.meetingDate, 'X').calendar();
        gamesession.organisedBy = TAPi18n.__('gamesessionOrganizedBy', gamesession.authorName, lang);
        return gamesession;
      });

      var emailData = {
        template: 'email_news',
        absoluteUrl: Meteor.absoluteUrl('', {secure: true}),
        subject: TAPi18n.__('emailNewsSubject', {}, lang),
        titleNewSessions: TAPi18n.__('emailNewsTitle', {}, lang),
        gamesessions: gamesessionsFormated,
        callToActionUrl: FlowRouter.url('gamesessionList'),
        callToAction: TAPi18n.__('emailNewsTitle', {}, lang),
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
      console.log("Mail sent to: " + player.emails[0].address)
    });

  }
});
