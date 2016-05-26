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

    console.log(emailData)

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
  }
});
