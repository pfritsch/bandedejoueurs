Template.home.helpers({
  currentUserName: function(){
    var currentUser = Meteor.user();
    if(currentUser) return getName(currentUser);
  }
});

Template.home.onCreated(function() {
  SEO.set({
    title: 'Bande de Joueurs',
    description: 'Jeux de société ou jeux vidéo. Trouve des partenaires pour tes jeux préférés.',
    meta: {
      'property="og:title"': 'Bande de joueurs',
      'property="og:type"': 'website',
      'property="og:url"': 'https://bandedejoueurs.com',
      'property="og:image"': 'https://bandedejoueurs.com/images/hero_big.jpg'
    }
  });
});
