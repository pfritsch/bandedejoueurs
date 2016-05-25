checkUser = function() {
  var user = Meteor.user();
  if(!(Meteor.loggingIn() || user)) {
    throwNotification(TAPi18n.__('errorNotUser'));
    return false
  } else {
    return true
  }
}
formatTitle = function(gamesession) {
  var title = gamesession.title+' ';
  if(!gamesession.boardgameTags && !gamesession.videogameTags) title = splitDay(moment(gamesession.meetingDate, 'X').hour())+' '+title;
  return title;
}
formatDate = function(meetingDate) {
  var date = moment(meetingDate, 'X');
  return (date.isAfter(moment(), 'day'))? date.calendar()+' '+TAPi18n.__('time.at')+' '+date.format('HH:mm') : date.fromNow();
}
formatLocation = function(meetingPlace) {
  if(meetingPlace.address) {
    return TAPi18n.__('helper.address', { street: meetingPlace.address.street, zipCode: meetingPlace.address.zipCode, city: meetingPlace.address.city} );
  } else if(meetingPlace.service) {
    var title = TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.'+meetingPlace.service.title);
    return TAPi18n.__('helper.platform', { title: title, additional: meetingPlace.service.additional});
  }
}
djb2 = function(str){
  var hash = 5381;
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash;
}
hashStringToColor = function(str) {
  var hash = djb2(str);
  var r = (hash & 0xFF0000) >> 16;
  var g = (hash & 0x00FF00) >> 8;
  var b = hash & 0x0000FF;
  return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2);
}
getName = function(user) {
  if(user.profile && user.profile.name) return user.profile.name;
  return user.username;
}
getUserCoordinates = function() {
  if(!Geolocation.error()) {
    var profile = (Meteor.user().profile)? Meteor.user().profile : { location: {} };
    if(!profile.address) {
      Tracker.autorun(function () {
        var newCoordinates = Geolocation.latLng();
        if(newCoordinates) {
          profile.location = {
            type: 'Point',
            coordinates: newCoordinates
          }
          Meteor.call("userEditProfile", profile);
        }
      });
    }
  }
}
getPlayerStatus = function(status){
  switch (status) {
    case 'pendingInvitation':
      return {pendingInvitation: true}
    break;
    case 'invited':
      return {invited: true}
    break;
    case 'accepted':
      return {accepted: true}
    break;
    default:
      return false
  }
}
rangeAge = function(age) {
 switch (true) {
  case age > 60:
    return "60+";
    break;
  case age > 50:
    return "50-60";
    break;
  case age > 40:
    return "40-50";
    break;
  case age > 35:
    return "35-40";
    break;
  case age > 30:
    return "30-35";
    break;
  case age > 25:
    return "25-30";
    break;
  case age > 20:
    return "20-25";
    break;
  case age > 15:
    return "15-20";
    break;
  case age > 10:
    return "10-15";
    break;
  case age > 5:
    return "5-10";
    break;
  case age <= 5:
    return "0-5";
    break;
  }
}

splitDay = function(time) {
  if(time < 12) return TAPi18n.__('time.morning');
  if(time < 18) return TAPi18n.__('time.afternoon');
  if(time >= 18) return TAPi18n.__('time.evening');
}

groupPlayersByStatus = function(players) {
  var groupedByStatus = _.groupBy(players,
    function(player) {
      return player.status;
    });
  var rplayers = [];
  for(status in groupedByStatus){
    rplayers.push({
      status: status,
      players: groupedByStatus[status],
      count: groupedByStatus[status].length
    })
  }
  return rplayers;
}
groupGamesessionsByDate = function(sessions) {
  var groupedByDates = _.groupBy(sessions,
    function(session) {
      var date = moment(session.meetingDate, 'X');
      return date.calendar();
    });
  var rsessions = [];
  for(date in groupedByDates){
    rsessions.push({
      date: date,
      gamesessions: groupedByDates[date],
      count: groupedByDates[date].length
    })
  }
  return rsessions;
}

getGamesessionsFilter = function() {
  var currentFilter = Session.get('gamesessionsFilter');
  var queryFilter = new Object();
  if(currentFilter.gameId) queryFilter.games = { $elemMatch: { gameId: currentFilter.gameId }};
  if(currentFilter.meetingType) {
    queryFilter.meetingType = { $in: currentFilter.meetingType };
    if(currentFilter.meetingType.indexOf('irl') > -1 && currentFilter.meetingPlace) {
      var reg = new RegExp(currentFilter.meetingPlace);
      queryFilter.$or = [
                          {"meetingPlace.address.city" : reg},
                          {"meetingPlace.address.address" : reg},
                          {"meetingPlace.address.zipCode" : reg}
                        ];
    }
    if(currentFilter.meetingType.indexOf('online') > -1 && currentFilter.meetingPlaceOnline) {
      queryFilter.$and = [{"meetingPlace.service.title" : new RegExp(currentFilter.meetingPlaceOnline)}];
    }
  }
  if (currentFilter.meetingDate > 0) {
    queryFilter.meetingDate = {$gte: currentFilter.meetingDate};
  }
  return queryFilter;
}

getBox = function() {
  if(GoogleMaps.maps) {
    var bounds = GoogleMaps.maps.map.instance.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    Session.set('box', [[sw.lat(),sw.lng()], [ne.lat(),ne.lng()]]);
  }
}

getGamesSuggestByTitle = function(title, category) {
  Session.set('suggests', []);
  if(category === '' || category === 'boardgame'){
    Meteor.call("getBoardGameByTitle", title, function(error, results) {
      if (!error) {
        Session.set('suggests', Session.get('suggests').concat(results));
        return results;
      } else {
        console.log(error)
        return false;
      }
    });
  }
  if(category === '' || category === 'videogame') {
    Meteor.call("getVideoGameByTitle", title, function(error, results) {
      if (!error) {
        for(game in results) results[game].category = 'videogame'
        Session.set('suggests', Session.get('suggests').concat(results));
        return results;
      } else {
        console.log(error)
        return false;
      }
    });
  }
}
