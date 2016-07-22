Template.gamesessionItem.helpers({
  gamesessionTags: function() {
    return (this.boardgameTags)? this.boardgameTags : this.videogameTags;
  },
  gameCover: function() {
    return (this.cover === Meteor.absoluteUrl()+'/images/cover_video.svg' || this.cover === Meteor.absoluteUrl()+'/images/cover_board.svg')? false : this.cover;
  },
  dateFormated: function() {
    return formatDate(this.meetingDate);
  },
  titleFormated: function() {
    return this;
  },
  author: function() {
    var author = Meteor.users.findOne(this.authorId) || {};
    return author;
  },
  descriptionTruncated: function() {
    if(this.description) return this.description.truncate(200,true);
  },
  playersLeft: function() {
    if(this.spots) {
      var availableSlots = this.spots - this.players.length;
      if(availableSlots > 0) {
        return TAPi18n.__('gamesessionItemSpots', {count: availableSlots});
      } else {
        return TAPi18n.__('gamesessionItemSpotsFull');
      }
    }
  }
});
Template.gamesessionItem.onCreated(function() {
  var self = this;
  var authorId = this.data.authorId;
  self.autorun(function() {
    self.subscribe('somePlayers', authorId);
  });
});
