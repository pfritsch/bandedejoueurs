Template.gamesessionDetail.helpers({
  gamesession: function() {
    var gamesessionId = FlowRouter.getParam('gamesessionId');
    var gamesession = Gamesessions.findOne({_id: gamesessionId}) || {};

    // Call for players & author datas
    var playersRegistered = gamesession.players;
    if(playersRegistered.indexOf(gamesession.authorId) < 0) playersRegistered.push(gamesession.authorId);
    Tracker.autorun(function() {
      Meteor.subscribe('somePlayers', {'_id': {'$in': playersRegistered}});
    });
    return gamesession;
  },
  gamesessionTags: function() {
    return (this.boardgameTags)? this.boardgameTags : this.videogameTags;
  },
  author: function() {
    var author = Meteor.users.findOne({_id: this.authorId});
    return author;
  },
  dateFormated: function() {
    return formatDate(this.meetingDate);
  },
  detailsFormated: function() {
    var details = ''
    var date = moment(this.meetingDate, 'X');
    details += '<span class="gamesession-detail-info"><svg class="icon is-inline"><use xlink:href="#icon-calendar" /></svg>';
    details += moment(date).format('LL');
    details += '</span>';
    details += '<span class="gamesession-detail-info"><svg class="icon is-inline"><use xlink:href="#icon-clock" /></svg>';
    details += TAPi18n.__('time.at')+' '+date.format('HH:mm');
    details += '</span>';
    var address = this.meetingPlace.address;
    if(address){
      if(address.city) {
        details += '<span class="gamesession-detail-info"><svg class="icon is-inline"><use xlink:href="#icon-location" /></svg>';
        details += TAPi18n.__('helper.inCity', address.city);
        if(address.zipCode) {
          details += ' ('+address.zipCode+')';
        }
        details += '</span>';
      }
    }
    var service = this.meetingPlace.service;
    if(service){
      if(service.title) {
        details += '<span class="gamesession-detail-info"><svg class="icon is-inline"><use xlink:href="#icon-'+service.title+'" /></svg>';
        var key = TAPi18n.__('schemas.gamesession.meetingPlace.service.title.options.'+service.title);
        details += TAPi18n.__('helper.onPlatform', key);
        details += '</span>';
      }
    }
    if(this.spots) {
      details += '<span class="gamesession-detail-info"><svg class="icon is-inline"><use xlink:href="#icon-cooperation" /></svg>';
      var availableSlots = this.spots - this.players.length;
      if(availableSlots > 0) {
        details += TAPi18n.__('gamesessionItemSpots', {count: availableSlots});
      } else {
        details += TAPi18n.__('gamesessionItemSpotsFull');
      }
    }
    return details;
  },
  playersRegistered: function() {
    return Meteor.users.find({'_id': {'$in': this.players}});
  },
  spotsAvailable: function() {
    return (!this.spots)? false : "("+this.players.length+"/"+this.spots+")";
  }
});

Template.gamesessionDetail.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var gamesessionId = FlowRouter.getParam('gamesessionId');
    self.subscribe('singleGamesession', gamesessionId, {
      onReady: function() {
        var gamesession = Gamesessions.findOne({_id: gamesessionId});
        var title = gamesession.title+" "+formatDate(gamesession.meetingDate);
        SEO.set({
          title: "Bande de joueurs - "+title,
          description: gamesession.description || TAPi18n.__('gamesessionDetailDesc', title),
          meta: {
            'property="og:image"': gamesession.cover,
            'name="twitter:image"': gamesession.cover
          }
        });
      }
    });
  });
});

Template.gamesessionDetail.events({
  'click .gamesession-subscribe': function(e){
    e.preventDefault();
    var newPlayer = Meteor.user();
  }
});
