getUserLanguage = function () {
  var userLang = navigator.language || navigator.userLanguage;
  if (['fr','en','de'].indexOf(userLang) >= 0) {
    return userLang;
  } else {
    return 'en';
  }
};

SEO = new FlowRouterSEO();
SEO.setDefaults({
  title: 'Bande de joueurs',
  description: 'Communauté de joueurs de jeux de société et de jeux vidéos. Organiser ou participer à une partie, rencontrer d\'autres joueurs près de chez soi ou en ligne.',
  meta: {
    'property="og:type"': 'website',
    'property="og:site_name"': 'Bande de joueurs',
    'name="twitter:card"': 'Trouve des partenaires pour tes jeux préférés',
    'name="twitter:site"': '@bandedejoueurs'
  }
});

if (Meteor.isClient) {
  Meteor.startup(function () {

    // Default sessions variables
    Session.setDefault('showGame', {boardgameTags: 1, videogameTags: 1});

    // Init Lang
    if(!localStorage.getItem('userLocale')) {
      localStorage.setItem('userLocale', getUserLanguage());
      if(Meteor.user()){
        Meteor.call('userEditLang', getUserLanguage());
      }
    }
    Session.setDefault('lang', localStorage.getItem('userLocale'));
    T9n.setLanguage(Session.get('lang'));
    TAPi18n.setLanguage(Session.get('lang'))
    .fail(function (error_message) {
      console.log(error_message);
    });

    // Init Moment js
    moment.locale(Session.get('lang'));

    // Settings Autoform
    AutoForm.setDefaultTemplate('plain');
  });
}
if (Meteor.isServer) {

  Meteor.startup(function () {

    // Add Facebook configuration entry
    ServiceConfiguration.configurations.update(
      { "service": "facebook" },
      {
        $set: {
          "appId": Meteor.settings.private.facebook.appId,
          "secret": Meteor.settings.private.facebook.secret
        }
      },
      { upsert: true }
    );
    // Add Twitter configuration entry
    ServiceConfiguration.configurations.update(
      { "service": "twitter" },
      {
        $set: {
          consumerKey: Meteor.settings.private.twitter.consumerKey,
          secret: Meteor.settings.private.twitter.secret
        }
      },
      { upsert: true }
    );
    // // Add Steam configuration entry
    // ServiceConfiguration.configurations.update(
    //   { "service": "steam" },
    //   {
    //     $set: {
    //       key: Meteor.settings.private.steam.key
    //     }
    //   },
    //   { upsert: true }
    // );
    // Add Google configuration entry
    ServiceConfiguration.configurations.update(
      { "service": "google" },
      {
        $set: {
          clientId: Meteor.settings.private.google.clientId,
          secret: Meteor.settings.private.google.secret
        }
      },
      { upsert: true }
    );
  });
}
