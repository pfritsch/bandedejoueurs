Meteor.startup(function () {
  process.env.MAIL_URL = "";
  process.env.MAIL_FROM = "Bande de joueurs <hello@bandedejoueurs.com>";
});
Meteor.methods({
  /**
  * Send an email
  * @param options - need \{"to", "subject", "html")\}
  */
  sendEmail: function (options) {
    check(options, {
        to:String,
        subject:String,
        html:String,
    });
    _.extend(options, {
      from: process.env.MAIL_FROM
    });
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send(options);
  },
  emailGamesessionConfirm: function (emailData) {
    user = Meteor.user();
    check(user, Object);
    check(user.emails[0], {
      address:String,
      verified:true
    });

    SSR.compileTemplate( 'htmlEmail', Assets.getText( 'email_gamesession_confirm.html' ));

    Email.send({
      to: "",
      from: process.env.MAIL_FROM,
      subject: "Example Email",
      html: SSR.render( 'htmlEmail', emailData )
    });
  }

});
