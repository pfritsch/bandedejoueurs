mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn" || state === "signUp") {
      Meteor.call("getUserSocialData", function(error, result){
        if (!error && state === "signUp") {
          // Send email to new member
          if (Meteor.isClient) {
            var emailData = {
              template: 'email_simple',
              absoluteUrl: Meteor.absoluteUrl('', {secure: true}),
              subject: TAPi18n.__('emailWelcomeSubject'),
              title: TAPi18n.__('emailWelcomeTitle', getName(Meteor.user())),
              subtitle: TAPi18n.__('emailWelcomeSubtitle'),
              text: TAPi18n.__('emailWelcomeText', {
                urlGamesessions: FlowRouter.url('gamesessionList'),
                urlPlayers: FlowRouter.url('playerMap'),
                urlProfile: FlowRouter.url('myProfile')}),
              callToActionUrl: FlowRouter.url('myProfile'),
              callToAction: TAPi18n.__('emailWelcomeCTA'),
              ciao: TAPi18n.__('emailCiao'),
              followUs: TAPi18n.__('emailFollowUs'),
              feedback: TAPi18n.__('emailFeedback')
            };
            Meteor.call('sendUserEmail', emailData);

            checkLang();
          }
        }
      });
    }
  }
};

// Options
AccountsTemplates.configure({

  // Behaviour
  confirmPassword: false,
  defaultState: "signIn",
  enablePasswordChange: true,
  overrideLoginErrors: false,
  sendVerificationEmail: false,
  redirectTimeout: 2000,
  socialLoginStyle: 'popup',

  // Appearance
  defaultLayout: 'layoutDefault',
  defaultLayoutRegions: {
    main: "main",
    header: "headerDefault"
  },
  defaultContentRegion: 'main',
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,

  // Client-side Validation
  continuousValidation: true,
  negativeFeedback: true,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,

  // Links
  homeRoutePath: '/',
  //privacyUrl: 'privacy',                // (default: undefined) - Affiche lien ?
  //termsUrl: 'terms-of-use',             // (default: undefined) - Affiche lien ?

  // Hooks
  //onLogoutHook: myLogoutFunc,           // Hook de routage appellé par AccountsTemplates.logout
  onSubmitHook: mySubmitFunc
  // preSignUpHook: myPreSubmitFunc,       // Comme ci-dessous mais appellé avant submit - func(password, info)
  // postSignUpHook: myPostSubmitFunc
});

var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: "username",
      type: "text",
      displayName: "username",
      required: true,
      minLength: 5,
  },{
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      errStr: 'Invalid email',
  },
  pwd
]);
