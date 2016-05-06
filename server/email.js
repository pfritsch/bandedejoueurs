Meteor.startup(function () {
  var login = Meteor.settings.private.mailgun.login;
  var password = Meteor.settings.private.mailgun.password;
  process.env.MAIL_FROM = "Bande de joueurs <hello@bandedejoueurs.com>";
  process.env.MAIL_URL = "smtp://"+login+":"+password+"@smtp.mailgun.org:465";
});
Meteor.methods({
  sendUserEmail: function (emailData) {
    this.unblock();

    user = Meteor.user();
    check(user, Object);
    check(user.emails[0], {
      address:String,
      verified:true
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
  sendAuthorEmail: function (emailData, authorId) {
    this.unblock();

    console.log(emailData)

    user = Meteor.user();
    check(user, Object);
    var author = Meteor.users.findOne(authorId);
    check(author, Object);
    check(author.emails[0], {
      address:String,
      verified:true
    });
    check(author.emailCheck, true);

    SSR.compileTemplate( 'htmlEmail', Assets.getText( emailData.template+'.html' ));

    Email.send({
      to: author.emails[0].address,
      from: process.env.MAIL_FROM,
      subject: emailData.subject,
      html: SSR.render( 'htmlEmail', emailData )
    });
    console.log("Mail sent to: " + author.emails[0].address)
  }
});
