Tags = new Mongo.Collection('tags');

Schema.tag = new SimpleSchema({
  label: {
    type: String
  },
  category: {
    type: String,
    allowedValues: [
      "boardgame",
      "videogame"
    ]
  },
  weight: {
    type: Number
  }
});

if (Meteor.isServer) {
  if (Tags.find().count() === 0) {
    var boardgame = [
        {
          name: "board",
          weight: 1
        },{
          name: "cards",
          weight: 1
        },{
          name: "dices",
          weight: 1
        },{
          name: "outside",
          weight: 0
        },{
          name: "wargame",
          weight: 1
        },{
          name: "rpg",
          weight: 1
        },{
          name: "party",
          weight: 0
        },{
          name: "puzzle",
          weight: 0
        },{
          name: "quizz",
          weight: 0
        }];
    var videogame = [
        {
          name: "pc",
          weight: 1
        },{
          name: "mac",
          weight: 1
        },{
          name: "linux",
          weight: 0
        },{
          name: "ios",
          weight: 0
        },{
          name: "android",
          weight: 0
        },{
          name: "ps4",
          weight: 1
        },{
          name: "ps3",
          weight: 1
        },{
          name: "xone",
          weight: 1
        },{
          name: "x360",
          weight: 1
        },{
          name: "wii",
          weight: 0
        },{
          name: "wiiu",
          weight: 0
        },{
          name: "3ds",
          weight: 0
        },{
          name: "psvita",
          weight: 0
        }];
    var style = [
        {
          name: "discussion",
          weight: 1
        },{
          name: "immersion",
          weight: 1
        },{
          name: "occasional",
          weight: 1
        },{
          name: "hardcore",
          weight: 1
        },{
          name: "oldshool",
          weight: 1
        },{
          name: "relaxation",
          weight: 1
        },{
          name: "competition",
          weight: 1
        },{
          name: "cooperation",
          weight: 1
        },{
          name: "sniper",
          weight: 1
        },{
          name: "brute",
          weight: 1
        },{
          name: "strategist",
          weight: 1
        },{
          name: "leader",
          weight: 1
        },{
          name: "support",
          weight: 1
        },{
          name: "infiltration",
          weight: 1
        }];
    var categories = {
      "boardgame": boardgame,
      "videogame": videogame,
      "style": style
    }
    for (category in categories) {
      for(tag in categories[category]) {
        Tags.insert({
          label: categories[category][tag].name,
          category: category,
          weight: categories[category][tag].weight
        });
      }  
    }
  }
}
Tags.allow({
  insert: function(userId, doc) {
    return !!userId;
  }
});
Meteor.startup(function() {
  Schema.tag.i18n("schemas.tag");
  Tags.attachSchema(Schema.tag);
});