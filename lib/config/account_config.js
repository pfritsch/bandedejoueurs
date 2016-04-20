T9n.map('fr', {
  error: {
    accounts: {
      'errStr': 'Hello'
    }
  }
});
T9n.setLanguage('fr');

mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      Meteor.call("getUserSocialData");
    }
    if (state === "signUp") {
      Meteor.call("getUserSocialData");
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
  sendVerificationEmail: true,
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
