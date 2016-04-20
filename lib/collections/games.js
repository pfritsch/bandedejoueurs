Schema = {};

Games = new Mongo.Collection('games');

Schema.game = new SimpleSchema({
  title: {
    type: String,
    unique: true
  },
  cover: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  category: {
    type: String,
    allowedValues: ['boardgame', 'videogame']
  },
  tags: {
    type: [String],
    optional: true
  }
});

if (Meteor.isServer) {
  if (Games.find().count() === 0) {
    var fixtureGames = [
      {
        "title": "Legends of Andor",
        "cover": "http://cf.geekdo-images.com/images/pic2606106_t.jpg",
        "category": "boardgame",
        "tags": ["board"]
      },{
        "title": "Tom Clancy's The Division",
        "cover": "http://static.giantbomb.com/uploads/scale_avatar/9/95676/2643697-91pvshkpjfl._sl1500_+-+copy.jpg",
        "category": "videogame",
        "tags": ["pc"]
      },{
        "title": "Total War: Shogun 2",
        "cover": "http://static.giantbomb.com/uploads/scale_avatar/9/93770/2392974-shogun_2_total_war_01_artwork.jpg",
        "category": "videogame",
        "tags": ["pc"]
      }
    ];
    for(item in fixtureGames) {
      var newGame = Games.insert({
        title : fixtureGames[item].title,
        cover : fixtureGames[item].cover,
        category : fixtureGames[item].category,
        tags : fixtureGames[item].tags
      });
    }
  }
}

Games.allow({
  insert: function(userId, doc) {
    return !!userId;
  }
});

Meteor.startup(function() {
  Schema.game.i18n("schemas.game");
  Games.attachSchema(Schema.game);
});