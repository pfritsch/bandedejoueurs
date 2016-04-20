Template.gamesessionPreview.helpers({
  gamesession: function() {
    var user = Meteor.user();
    var gamesessionId = FlowRouter.getParam('gamesessionId');
    var gamesession = Gamesessions.findOne({_id: gamesessionId}) || {};
    if(user && user._id === gamesession.authorId){
      return gamesession;
    } else {
      FlowRouter.go('gamesessionDetail', {gamesessionId: gamesessionId});
    }
  },
  linkAbsolute: function() {
    return Meteor.absoluteUrl()+'gamesessions/'+this._id;
  },
  linkTwitter: function() {
    var link = Meteor.absoluteUrl()+'gamesessions/'+this._id;
    var title = this.title;
    var date = moment(this.meetingDate, 'X').calendar();
    if(!this.boardgameTags && !this.videogameTags) title = splitDay(moment(this.meetingDate, 'X').hour())+' '+title;
    var text = TAPi18n.__('gamesessionShareMsgTwitter', title+' '+date+' '+link);
    return encodeURI(text);
  }
});

Template.gamesessionPreview.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var gamesessionId = FlowRouter.getParam('gamesessionId');
    self.subscribe('singleGamesession', gamesessionId);
  });
});
