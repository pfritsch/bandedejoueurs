Template.playerList.helpers({
  allPlayers: function() {
    return Meteor.users.find();
  },
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  },
  mapOptions: function() {
    var latLng = {
      lat: 46,
      lng: 8
    };
    var newCoordinates = Geolocation.latLng();
    if(newCoordinates) {
      latLng = Geolocation.latLng();
    } else if(Meteor.user()) {
      latLng = Meteor.user().profile.coordinates;
    }
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

Template.playerList.onRendered(function() {
  GoogleMaps.load({key: Meteor.settings.public.googleMap.key});
});

Template.playerList.events({
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
  'change [name="searchPlayerList"]': function(e, tpl) {
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

Template.playerList.onCreated(function() {
  var self = this;
  var markers = {};

  Session.set('selectedPlayer', null);

  GoogleMaps.ready('map', function(map) {
    getBox();

    self.mapPlayers = map.instance;

    if(Meteor.user()) {
      getUserCoordinates();
    }

    self.autorun(function() {
      Meteor.subscribe('mapPlayers', Session.get('box'));

      Meteor.users.find().observe({
        added: function(document) {
          if(document._id && document.profile) {
            if(!markers[document._id] && document.profile.location) {
              var iconMarker = 'images/marker_default.png';
              if(document._id === Meteor.userId()) iconMarker = 'images/marker_me.png';
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
});
