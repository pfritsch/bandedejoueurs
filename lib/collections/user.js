Schema.coordinates = new SimpleSchema({
  lat: {
    type: Number,
    decimal: true
  },
  lng: {
    type: Number,
    decimal: true
  }
});

Schema.message = new SimpleSchema({
  playerId: {
    type: String,
  },
  text: {
    type: String
  },
  date: {
    type: Number
  },
  fromUser: {
    type: Boolean,
    optional: true
  },
  status: {
    type: String,
    defaultValue: "new",
    allowedValues: ["new", "read"]
  }
});

Schema.location = new SimpleSchema({
  type : {
    type : String,
    allowedValues: ['Point'],
    optional: true
  },
  coordinates: {
    type: Schema.coordinates,
    optional: true
  }
});

Schema.userProfile = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  birthday: {
    type: Number,
    optional: true,
    regEx: /^\d{4}$/
  },
  gender: {
    type: String,
    allowedValues: ['XX', 'XY'],
    optional: true
  },
  address: {
    type: Schema.address,
    optional: true
  },
  bio: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: "textarea"
      }
    }
  },
  location: {
    type: Schema.location,
    optional: true,
    defaultValue: {}
  },
  gamesessions: {
    type: [String],
    optional: true,
    blackbox: true
  },
  style: {
    type: [String],
    optional: true,
    autoform: {
      type: 'select-checkbox-inline',
      options: function () {
        return Tags.find({category: 'style'}).map(function (tag) {
          return {label: TAPi18n.__(tag.label), value: tag.label};
        });
      }
    }
  }
});

Schema.user = new SimpleSchema({
  username: {
    type: String,
    optional: true,
    unique: true
  },
  emails: {
    type: Array,
    optional: true,
    blackbox: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean,
    defaultValue: true
  },
  messages: {
    type: [Schema.message],
    defaultValue: []
  },
  createdAt: {
    type: Date
  },
  emailCheck: {
    type: Boolean,
    defaultValue: true,
    autoform: {
      type: 'boolean-checkbox'
    }
  },
  profile: {
    type: Schema.userProfile,
    optional: true,
    defaultValue: {}
  },
  lang: {
    type: String,
    optional: true,
    allowedValues: ['en', 'de', 'fr'],
    defaultValue: 'en'
  },
  avatar: {
    type: String,
    optional: true,
    blackbox: true
  },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  }
});

Meteor.users.allow({
  insert: function(userId, doc) {
    return !!userId;
  },
  update: function(userId, doc) {
    return userId === doc._id;
  },
  remove: function (userId, doc) {
    var currentUser;
    currentUser = Meteor.users.findOne({ _id: userId });
    return userId === doc._id;
  }
});
Meteor.startup(function() {
  Schema.user.i18n("schemas.user");
  Meteor.users.attachSchema(Schema.user);
});
