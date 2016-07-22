getUserLanguage = function () {
  var userLang = localStorage.getItem('userLocale') || navigator.language || navigator.userLanguage;
  if (['fr','en','de'].indexOf(userLang) >= 0) {
    return userLang;
  } else {
    return 'fr';
  }
};

SEO = new FlowRouterSEO();
SEO.setDefaults({
  title: 'Bande de joueurs',
  description: 'Rencontrer d\'autre joueurs, organiser des soirées jeux ou des parties multijoueur ou co-op en ligne.',
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

    checkLang();

    PlayersOnMap = new Meteor.Collection("playersOnMap");
    PlayersNotMap = new Meteor.Collection("playersNotMap");

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
