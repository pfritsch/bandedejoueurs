Meteor.methods({
  sendUserEmail: function (emailData) {
    this.unblock();

    user = Meteor.user();
    check(user, Object);

    if(user.emails) {
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
    }
  },
  sendPlayerEmail: function (emailData, playerId) {
    this.unblock();

    user = Meteor.user();
    check(user, Object);
    var player = Meteor.users.findOne(playerId);
    check(player, Object);

    if(player.emails){
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
    }
  },
  sendNews: function (gamesessions, title) {
    this.unblock();

    var players = Meteor.users.find({'emailCheck': true, emails: { $exists: true }});

    if (gamesessions.length > 0) {

      players.forEach(function(player){

        if(player.emails && typeof player.emails[0] !== 'undefined' && player.emails[0] !== null) {
          var lang = player.lang || 'en';
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
        }

      });

      gamesessions.forEach(function(gamesession){
        Gamesessions.update(gamesession._id, {
          $set : {emailSent : true}
        });
      });

    }
  }
});
