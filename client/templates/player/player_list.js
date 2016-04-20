Session.setDefault('centerLatLng', {
  lat: 46,
  lng: 8
});

Template.playerList.helpers({
  allPlayers: function() {
    return Meteor.users.find();
  },
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  },
  mapOptions: function() {
    var latLng = Session.get('centerLatLng');
    if(!Geolocation.error()) {
      latLng = Geolocation.latLng();
    } else if(Meteor.user()) {
      latLng = Meteor.user().profile.coordinates;
    }
    if (GoogleMaps.loaded() && latLng) {
      return {
        center: new google.maps.LatLng(latLng),
        zoom: 8,
        maxZoom: 14
      };
    }
  }
})

Template.playerList.onRendered(function() {
  // Session.set('showLoadingIndicator', true);
  GoogleMaps.load({key: Meteor.settings.public.googleMap.key});
});

Template.playerList.onCreated(function() {
  var self = this;
  var handle = {};
  var markers = {};
  Session.set('selectedPlayer', null);

  // self.autorun(function() {
  //   self.subscribe('allPlayers', Session.get('box'));
  // });

  GoogleMaps.ready('map', function(map) {
    getBox();

    if(Meteor.user()) {
      getUserCoordinates();
    }

    self.autorun(function() {
      Meteor.subscribe('mapPlayers', Session.get('box'));

      Meteor.users.find().observe({
        added: function(document) {
          if(!markers[document._id]) {
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
            // Store this marker instance within the markers object.
            // cluster.push(marker);
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

          // var index = cluster.contains('id', oldDocument._id);
          // if (index > -1) cluster.splice(index, 1);
        }
      });
      // }
      // var markerCluster = new MarkerClusterer(map.instance, cluster);
    });

    google.maps.event.addListener(map.instance, 'dragend', function(e){
     getBox();
    });

    google.maps.event.addListener(map.instance, 'zoom_changed', function(e){
     getBox();
    });

  });
});
