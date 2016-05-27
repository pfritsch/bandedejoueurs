Gamesessions = new Mongo.Collection('gamesessions');

Schema.address = new SimpleSchema({
  "country": {
    type: String,
    optional: true,
    autoform: {
      options: function () {
        return Countries.find().map(function (c) {
          return {label: c.name, value: c.iso};
        });
      }
    }
  },
  "city": {
    type: String
  },
  "zipCode": {
    type: Number,
    optional: true
  },
  "street": {
    type: String,
    optional: true
  }
});

Schema.service = new SimpleSchema({
  title: {
    type: String,
    autoform: {
      defaultValue: 'other'
    }
  },
  additional: {
    type: String
  }
});

Schema.place = new SimpleSchema({
  address: {
    type: Schema.address,
    optional: true
  },
  service: {
    type: Schema.service,
    optional: true
  }
});

Schema.gamesession = new SimpleSchema({
  authorId: {
    type: String,
    defaultValue: function(){
      return this.userId
    }
  },
  authorName: {
    type: String
  },
  meetingType: {
    type: String,
    autoform: {
      defaultValue: 'irl',
      allowedValues: ['irl', 'online']
    }
  },
  meetingPlace: {
    type: Schema.place
  },
  meetingDate: {
    type: Number
  },
  spots: {
    type: Number,
    optional: true,
    min: 2
  },
  boardgameTags: {
    type: [String],
    optional: true,
    autoform: {
      type: 'select-checkbox-inline',
      options: function () {
        var filterGame = (Session.get('showGame'))? Session.get('showGame').boardgameTags : 1;
        return Tags.find({category: 'boardgame', weight: {$gte: filterGame }}).map(function (tag) {
          return {label: TAPi18n.__(tag.label), value: tag.label};
        });
      }
    }
  },
  videogameTags: {
    type: [String],
    optional: true,
    autoform: {
      type: 'select-checkbox-inline',
      options: function () {
        var filterGame = (Session.get('showGame'))? Session.get('showGame').videogameTags : 1;
        return Tags.find({category: 'videogame', weight: {$gte: filterGame }}).map(function (tag) {
          return {label: TAPi18n.__(tag.label), value: tag.label};
        });
      }
    }
  },
  players: {
    type: [String],
    optional: true,
    defaultValue: function(){
      return [this.userId]
    }
  },
  games: {
    type: [Object],
    optional: true
  },
  "games.$.gameId": {
    type: String
  },
  "games.$.title": {
    type: String,
    autoform: {
      type: 'universe-select'
    }
  },
  "games.$.cover": {
    type: String
  },
  cover: {
    type: String,
    optional: true
  },
  title: {
    type: String
  },
  description: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
  }
});
Gamesessions.allow({
  insert: function(userId, doc) {
    return !!userId;
  },
  update: function (userId, doc) {
    return userId === doc.authorId;
  },
  remove: function (userId, doc) {
    return userId === doc.authorId;
  }
});
Meteor.startup(function() {
  Schema.gamesession.i18n("schemas.gamesession");
  Gamesessions.attachSchema(Schema.gamesession);
});
