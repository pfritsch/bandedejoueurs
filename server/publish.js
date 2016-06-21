Meteor.publish('currentUserData', function() {
  return Meteor.users.find(this.userId);
});

Meteor.publish('somePlayers', function(filters) {
  return Meteor.users.find(filters, {fields: {
    username: 1,
    'createdAt': 1,
    'profile.name': 1,
    'profile.birthday': 1,
    'profile.gender': 1,
    'profile.address.city': 1,
    'profile.bio': 1,
    'profile.location': 1,
    'profile.style': 1,
    'profile.gamesessions': 1,
    avatar: 1
  }});
});

Meteor.publish('mapPlayers', function(box) {
  // Filter users within the map box
  var filters = {};
  if(box) filters = {
    $and: [
      {'profile.location':{$exists:true}},
      {'profile.location.coordinates': {
          $geoWithin: {
            $box: box
          }
        }
      }
    ]
  };
  return Meteor.users.find(filters, {fields: {
    username: 1,
    'createdAt': 1,
    'profile.name': 1,
    'profile.birthday': 1,
    'profile.gender': 1,
    'profile.address.city': 1,
    'profile.bio': 1,
    'profile.location': 1,
    avatar: 1
  }});
});

Meteor.publish('someGames', function(filters, options) {
  if(options) {
    check(options, Object);
  } else {
    var options = {};
  }
  return Games.find(filters, options);
});

Meteor.publish('gamesessions', function(filter, options) {
  check(filter, Object);
  if(options) {
    check(options, {
      sort: Object,
      limit: Number
    });
    if (options.limit === 0){
      delete options.limit;
    }
  } else {
    var options = {};
  }
  return Gamesessions.find(filter, options);
});

Meteor.publish('singleGamesession', function(gamesessionId) {
  check(gamesessionId, String);
  return Gamesessions.find(gamesessionId);
});

Meteor.publish('tags', function(filter, options) {
  return Tags.find();
});
