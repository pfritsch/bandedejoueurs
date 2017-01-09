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
      var urlDefault = encodeURIComponent(Meteor.absoluteUrl()+'images/default.png');
      user.avatar = 'https://secure.gravatar.com/avatar/'+Gravatar.hash(email)+'?d='+urlDefault;
    } else {
      user.emails = [];
    }
    if(user.services){
      if(user.services.google) {
        if(!user.username) user.username = user.services.google.given_name;
        if(!user.profile.name) user.profile.name = user.services.google.name;
        if(!user.profile.gender) {
          if(user.services.google.gender === 'female') user.profile.gender = 'XX';
          if(user.services.google.gender === 'male') user.profile.gender = 'XY';
        }
        user.avatar = user.services.google.picture;
        if(!user.emails[0]) {
          email = user.services.google.email;
          user.emails = [{ address: email, verified: true } ];
        }
      }
      else if(user.services.twitter) {
        if(!user.username) user.username = user.services.twitter.screenName;
        var picture = user.services.twitter.profile_image_url_https;
        user.avatar = picture.replace('_normal','');
      }
      else if(user.services.facebook) {
        // if(!user.username) user.username = user.services.facebook.email.substring(0, user.services.facebook.email.indexOf("@"));
        if(!user.username) user.username = user.services.facebook.username;
        if(!user.profile.name) user.profile.name = user.services.facebook.name;
        if(!user.profile.gender) {
          if(user.services.facebook.gender === 'female') user.profile.gender = 'XX';
          if(user.services.facebook.gender === 'male') user.profile.gender = 'XY';
        }
        user.avatar = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
        if(!user.emails[0]) {
          email = user.services.facebook.email;
          user.emails = [{ address: email, verified: true } ];
        }
      }
      // else if(user.services.steam) {
      //   if(!user.username) user.username = user.services.github.username;
      // }
      if(!user.username) user.username = email.substring(0, email.indexOf("@"));
    }

    try {
      Meteor.users.update(Meteor.userId(), {
        $set : {username : user.username, profile : user.profile, avatar : user.avatar, emails: user.emails}
      });
    } catch (e) {
      throw new Meteor.Error(500, 'Exception in getting user social data', e);
    } finally {
      console.log("Update social data from "+user.username);
    }

  },
  userEditProfile: function(doc) {
    user = Meteor.user();
    check(doc, Schema.userProfile);
    try {
      Meteor.users.update(Meteor.userId(), {$set: {profile : doc}});
    } catch (e) {
      throw new Meteor.Error(500, 'Exception in updating user data', e);
    } finally {
      console.log("Update user profile from "+user.username);
    }
  },
  userRemoveProfile: function(userId) {
    user = Meteor.user();
    check(user, Object);

    // Remove all gamesessions from this user
    Gamesessions.remove({authorId: user._id});

    // Remove the current user
    try {
      Meteor.users.remove({ _id: userId});
    } catch (e) {
      throw new Meteor.Error(500, 'Exception in removing user', e);
    } finally {
      console.log("Remove user "+user.username);
    }
  },
  userEditID: function(doc) {
    check(doc, Schema.user);
    try {
      Meteor.users.update(Meteor.userId(), {$set: {username : doc.username}});
    } catch (e) {
      throw new Meteor.Error(500, 'Exception in editing user ID', e);
    } finally {
      console.log("Update user ID "+doc.username);
    }
  },
  userEditLang: function(lang) {
    user = Meteor.user();
    check(user, Object);
    try {
      Meteor.users.update(Meteor.userId(), {$set: {'lang' : lang}});
    } catch (e) {
      throw new Meteor.Error(500, 'Exception in change lang', e);
    } finally {
      console.log("Change lang for "+user.username+" - "+lang);
    }
  },
  userSendMessage: function(playerId, text) {
    user = Meteor.user();
    check(user, Object);
    check(playerId, String);
    check(text, String);
    var now = moment().unix();

    var messagesFromPlayer = user.messages.filter(function(msg){
      return msg.playerId === playerId && msg.fromUser != true;
    });
    var messagesFromMe = Meteor.user().messages.filter(function(msg){
      return msg.playerId === playerId && msg.fromUser === true;
    });
    if(messagesFromPlayer.length === 0 && messagesFromMe.length >= 5) return false;

    // Add message to player
    try {
      Meteor.users.update(playerId, {$addToSet: {'messages': {
        'playerId': Meteor.userId(),
        'date': now,
        'text': text,
        'status': "new"
      }}});
    } catch (e) {
      throw new Meteor.Error(500, 'Exception in sending message', e);
    } finally {
      console.log("Message sent to "+playerId);
    }

    // Add message to user
    try {
      Meteor.users.update(Meteor.userId(), {$addToSet: {'messages': {
        'playerId': playerId,
        'date': now,
        'text': text,
        'fromUser': true,
        'status': "read"
      }}});
    } catch (e) {
      throw new Meteor.Error(500, 'Exception in sending message', e);
    } finally {
      console.log("Message sent to "+Meteor.userId());
    }
  },
  userReadMessage: function(playerId) {
    user = Meteor.user();
    check(user, Object);
    check(playerId, String);

    var messages = user.messages;

    var readMessages = messages.map(function(msg,index){
      if(msg.playerId === playerId) msg.status = 'read'
      return msg;
    });

    try {
      Meteor.users.update(Meteor.userId(), {$set: {'messages': readMessages}});
    } catch (e) {
      throw new Meteor.Error(500, 'Exception in reading message', e);
    } finally {
      console.log("Message read by "+user.username);
    }
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
  },
  geoLocalizePlace: function(place) {
    var geo = new GeoCoder();
    var newCoordinates = {
      lat: geo.geocode(place)[0].latitude,
      lng: geo.geocode(place)[0].longitude
    }
    return newCoordinates;
  },
  geoLocalizeReverse: function(lat, lng) {
    var geo = new GeoCoder();
    return geo.reverse(lat, lng);
  },
  getVideoGameByTitle: function (query) {
    this.unblock();
    var giantBombKey = Meteor.settings.private.giantBomb;
    var fields = 'name,platforms,image';
    var url = 'https://www.giantbomb.com/api/search/?api_key='+giantBombKey+'&format=json&query="'+query+'"&resources=game&field_list='+fields;
    var gamesFound = HTTP.get(url, {headers: {"User-Agent": "Meteor/1.0"}});
    return gamesFound.data.results;
  },
  getBoardGameByTitle: function (query) {
    this.unblock();
    var url = 'https://www.boardgamegeek.com/xmlapi2/search?query="'+query+'"&type=boardgame';
    var xml = HTTP.get(url).content;
    var gamesFound = [];
    xml2js.parseString(xml, function (error, result) {
      if(!error && result.items) {
        for (i in result.items.item) {
          if(i < 30) gamesFound.push({
            id: result.items.item[i].$.id,
            name: result.items.item[i].name[0].$.value,
            category: 'boardgame'
          });
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
    var url = 'https://bgg-json.azurewebsites.net/thing/'+query;
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
  }
});
