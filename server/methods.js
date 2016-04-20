Meteor.methods({
  getUserSocialData: function(){
    user = Meteor.user();
    check(user, Object);

    user.username = user.username || '';
    user.profile = user.profile || {};
    user.avatar = user.avatar || undefined;
    var email = '';

    if(user.emails) {
      email = user.emails[0].address;
      var urlDefault = encodeURIComponent('http://'+Meteor.absoluteUrl()+'images/default.svg');
      user.avatar = 'https://secure.gravatar.com/avatar/'+Gravatar.hash(email)+'?d='+urlDefault;
    } else {
      user.emails = [];
    }
    if(user.services){
      if(user.services.google) {
        user.username = user.services.google.given_name;
        email = user.services.google.email;
        user.emails = [{ address: email, verified: true } ];
        user.profile.name = user.services.google.name;
        user.profile.gender = user.services.google.gender;
        user.avatar = user.services.google.picture;
        if(!user.username) user.username = user.services.facebook.email.substring(0, user.services.facebook.email.indexOf("@"));
      }
      else if(user.services.twitter) {
        user.username = user.services.twitter.screenName;
        var picture = user.services.twitter.profile_image_url_https;
        user.avatar = picture.replace('_normal','');
      }
      else if(user.services.facebook) {
        user.username = user.services.facebook.username;
        user.profile.name = user.services.facebook.name;
        if(user.services.facebook.gender === 'female') user.profile.gender = 'XX';
        if(user.services.facebook.gender === 'male') user.profile.gender = 'XY';
        user.avatar = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
        email = user.services.facebook.email;
        user.emails = [{ address: email, verified: true } ];
      }
      else if(user.services.steam) {
        user.username = user.services.github.username;
      }
      if(!user.username) user.username = email.substring(0, email.indexOf("@"));
    }
    Meteor.users.update(Meteor.userId(), {
      $set : {username : user.username, profile : user.profile, avatar : user.avatar, emails: user.emails}
    });
  },
  userEditProfile: function(doc) {
    check(doc, Schema.userProfile);
    Meteor.users.update(Meteor.userId(), {$set: {profile : doc}});
  },
  userEditID: function(doc) {
    check(doc, Schema.user);
    Meteor.users.update(Meteor.userId(), {$set: {username : doc.username}});
  },
  userAddPlayer: function(playerId) {
    user = Meteor.user();
    check(user, Object);
    if(!user.profile.group) user.profile.group = [];
    if(user.profile.group.indexOf(playerId) > -1) {
      Meteor.users.update(Meteor.userId(), {$pull: {'profile.group': playerId}});
    } else {
      Meteor.users.update(Meteor.userId(), {$addToSet: {'profile.group': playerId}});
    }
  },
  geoLocalizePlace: function(place) {
    var geo = new GeoCoder();
    var newCoordinates = {
      lat: geo.geocode(place)[0].latitude,
      lng: geo.geocode(place)[0].longitude
    }
    return newCoordinates;
  },
  getVideoGameByTitle: function (query) {
    this.unblock();
    var giantBombKey = Meteor.settings.private.giantBomb;
    var fields = 'name,platforms,image';
    var url = 'http://www.giantbomb.com/api/search/?api_key='+giantBombKey+'&format=json&query="'+query+'"&resources=game&field_list='+fields;
    var gamesFound = HTTP.get(url, {headers: {"User-Agent": "Meteor/1.0"}});
    return gamesFound.data.results;
  },
  getBoardGameByTitle: function (query) {
    this.unblock();
    var url = 'http://www.boardgamegeek.com/xmlapi2/search?query="'+query+'"&type=boardgame';
    var xml = HTTP.get(url).content;
    var gamesFound = [];
    xml2js.parseString(xml, function (error, result) {
      if(!error && result.items) {
        for (i in result.items.item) {
          var id = result.items.item[i].$.id;
          var name = result.items.item[i].name[0].$.value;
          if(i < 30) gamesFound.push({id: id, name: name, category: 'boardgame'});
        }
      } else if(error) {
        return {error: error.message};
      } else {
        return {error: 'No result'};
      }
    });
    return gamesFound;
  },
  getBoardGameImageById: function (query) {
    this.unblock();
    var url = 'http://bgg-json.azurewebsites.net/thing/'+query;
    try {
      var gameFound = HTTP.get(url, {headers: {"User-Agent": "Meteor/1.0"}});
      if (gameFound.statusCode === 200) {
        return gameFound
      } else if(error) {
        return {error: error.message};
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },
  getGamesTitleOptions: function (query) {
    this.unblock();

    var filter = {};
    var options = {
      limit: 5,
      sort : { title : 1 }
    };

    var searchText = query.searchText;
    var values = query.values;

    if(query.params) var category = query.params.category;

    if (searchText && category) {
      filter = {
        $and: [
          {category: {$regex: category}},
          {title: {$regex: searchText}}
        ]
      };
    } else if (category && !searchText) {
      filter = {
        category: {$regex: category}
      };
    } else if (searchText && !category) {
      filter = {
        title: {$regex: searchText}
      };
    } else if (values.length) {
      filter = {
        value: {$in: values}
      };
      limit = {};
    }
    return Games.find(filter, options).map((res) => {
      return {
        label: res.title,
        value: res._id
      };
    });
  },
  joinGamesession: function (gamesessionId) {
    user = Meteor.user();
    check(user, Object);
    Meteor.users.update(user._id, {$addToSet: {'profile.gamesessions': gamesessionId}});
    Gamesessions.update(gamesessionId, {$addToSet: {players: user._id}});
  },
  leaveGamesession: function (gamesessionId) {
    user = Meteor.user();
    check(user, Object);
    Meteor.users.update(user._id, {$pull: {'profile.gamesessions': gamesessionId}});
    Gamesessions.update(gamesessionId, {$pull: {players: user._id}});
  }
});
