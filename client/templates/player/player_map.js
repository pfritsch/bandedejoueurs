Template.playerMap.helpers({
  playersOnMap: function() {
    return Meteor.users.find({ _id: {$ne: Meteor.userId()} }, {sort: {createdAt: -1}});
  },
  currentUser:function() {
    return Meteor.user();
  },
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  },
  mapLoaded: function() {
    return GoogleMaps.loaded();
  },
  mapOptions: function() {
    var latLng = {
      lat: 47,
      lng: 4
    };
    // if(!Geolocation.error()) {
    //   latLng = Geolocation.latLng();
    // } else
    if(Meteor.user() && Meteor.user().profile.location.coordinates != null) {
      latLng = Meteor.user().profile.location.coordinates;
    }
    // console.log(latLng);
    if (GoogleMaps.loaded() && latLng) {
      return {
        center: new google.maps.LatLng(latLng),
        zoom: 6,
        maxZoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        scrollwheel: false
      };
    }
  }
})

Template.playerMap.onRendered(function() {
  GoogleMaps.load({key: Meteor.settings.public.googleMap.key});
});

Template.playerMap.events({
  'click': function(e, tpl) {
    var clickedInsideMap = $(e.target).parents('.player-map').length > 0;
    if(!clickedInsideMap && tpl.mapPlayers) {
      disableScrollingWithMouseWheel(tpl.mapPlayers);
    }
  },
  'scroll': function(e, tpl) {
    var clickedInsideMap = $(e.target).parents('.player-map').length > 0;
    if(!clickedInsideMap && tpl.mapPlayers) {
      disableScrollingWithMouseWheel(tpl.mapPlayers);
    } else if($(window).width() > 1024 && tpl.mapPlayers) {
      enableScrollingWithMouseWheel(tpl.mapPlayers);
    }
  },
  'click .share-position': function(e, tpl) {
    getUserCoordinates();
  },
  'change [name="searchplayerMap"]': function(e, tpl) {
    e.preventDefault();
    var location = $(e.target).val();
    var map = tpl.mapPlayers;
    if(location.length > 3) {
      Meteor.call('geoLocalizePlace', location, function (error, result) {
        if(!error && result) {
          map.setOptions({
            center: new google.maps.LatLng(result),
            zoom: 10,
          })
        } else {
          console.log(error);
        }
      });
    }
  }
});

function enableScrollingWithMouseWheel(map) {
  map.setOptions({ scrollwheel: true });
}
function disableScrollingWithMouseWheel(map) {
  map.setOptions({ scrollwheel: false });
}

Template.playerMap.onCreated(function() {

  var self = this;
  var markers = {};

  self.autorun(function() {
    SEO.set({
      title: 'Bande de joueurs | '+TAPi18n.__('playerDetailallPlayers')
    });
  });

  Session.set('selectedPlayer', null);

  GoogleMaps.ready('map', function(map) {
    getBox();

    self.mapPlayers = map.instance;

    self.autorun(function() {
      Meteor.subscribe('playersOnMap', Session.get('box'));

      Meteor.users.find().observe({
        added: function(document) {
          if(document._id && document.profile) {
            if(!markers[document._id] && document.profile.location) {
              if(document.profile.location.coordinates) {
                var iconMarker = 'images/marker_default.png';

                // Create a marker for this document
                var latLng = new google.maps.LatLng(document.profile.location.coordinates.lat, document.profile.location.coordinates.lng);
                var marker = new google.maps.Marker({
                  animation: google.maps.Animation.DROP,
                  position: latLng,
                  map: map.instance,
                  icon: iconMarker,
                  optimized: false,
                  id: document._id
                });
                markers[document._id] = marker;

                marker.addListener('click', function(){
                  Session.set('selectedPlayer', this.id);
                  for(item in markers) {
                    markers[item].setIcon('images/marker_default.png');
                    this.setZIndex();
                  }
                  this.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
                  this.setIcon('images/marker_selected.png');

                  var currentPath = FlowRouter.current().path;
                  FlowRouter.go(currentPath+'#'+document.username);
                });
              }
            }
          }
        },
        changed: function(newDocument, oldDocument) {
          markers[newDocument._id].setPosition({ lat: newDocument.profile.location.coordinates.lat, lng: newDocument.profile.location.coordinates.lng });
        },
        removed: function(oldDocument) {
          // Remove the marker from the map
          markers[oldDocument._id].setMap(null);
          // Clear the event listener
          google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
          // Remove the reference to this marker instance
          delete markers[oldDocument._id];
        }
      });
    });

    google.maps.event.addListener(map.instance, 'dragend', function(e){
     getBox();
    });

    google.maps.event.addListener(map.instance, 'zoom_changed', function(e){
     getBox();
    });

    google.maps.event.addListener(map.instance, 'mousedown', function(e){
      enableScrollingWithMouseWheel(map.instance);
    });

  });

  // setTimeout(function(){
  //   if(!GoogleMaps.loaded()) {
  //     Meteor.subscribe('somePlayers', {});
  //   }
  // }, 1000);
});