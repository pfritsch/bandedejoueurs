checkUser = function() {
  var user = Meteor.user();
  if(!(Meteor.loggingIn() || user)) {
    throwNotification(TAPi18n.__('errorNotUser'));
    return false
  } else {
    return true
  }
}
checkLang = function() {
  // Init Lang
  var lang = getUserLanguage();
  if(!localStorage.getItem('userLocale')) {
    localStorage.setItem('userLocale', lang);
  }
  if(Meteor.user()){
    Meteor.call('userEditLang', lang);
  }
  Session.setDefault('lang', localStorage.getItem('userLocale'));
  T9n.setLanguage(Session.get('lang'));
  TAPi18n.setLanguage(Session.get('lang'))
  .fail(function (error_message) {
    console.log(error_message);
  });

  // Init Moment js
  moment.locale(Session.get('lang'));
}
formatDate = function(meetingDate) {
  var date = moment(meetingDate, 'X');
  return (date.isAfter(moment(), 'day'))? date.calendar() : date.fromNow();
}
formatLocation = function(meetingPlace) {
  if(meetingPlace.address) {
    return TAPi18n.__('helper.address', { street: meetingPlace.address.street, zipCode: meetingPlace.address.zipCode, city: meetingPlace.address.city} );
  } else if(meetingPlace.service) {
    var title = TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.'+meetingPlace.service.title);
    return TAPi18n.__('helper.platform', { title: title, additional: meetingPlace.service.additional});
  }
}
getUserCoordinates = function() {
  if(!Geolocation.error()) {
    var profile = Meteor.user().profile;
    Tracker.autorun(function () {
      var newCoordinates = Geolocation.latLng();
      if(newCoordinates) {
        Meteor.call('geoLocalizeReverse', newCoordinates.lat, newCoordinates.lng, function (error, result) {
          if(!error && result) {
            if(!profile.location) {
              profile.location = {
                type: 'Point',
                coordinates: newCoordinates
              }
            }
            if(!profile.address) {
              profile.address = {
                "city": result[0].city,
                "zipCode": parseInt(result[0].zipcode)
              }
            }
            Meteor.call("userEditProfile", profile);
            Session.set('searchPlaceValue', result[0].city);
          } else {
            console.log(error);
          }
        });
      }
    });
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
