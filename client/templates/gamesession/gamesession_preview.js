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
    var text = "https://twitter.com/intent/tweet?text="+encodeURI(TAPi18n.__('gamesessionShareMsgTwitter', title+' '+date+' '+link));
    return text;
  },
  linkFacebook: function() {
    var app_id = 1570718869885594;
    var href = Meteor.absoluteUrl()+'gamesessions/'+this._id;
    var redirect_uri = href;
    var url = "https://www.facebook.com/dialog/share?app_id="+app_id+"+&display=popup&href="+href+"&redirect_uri="+redirect_uri+"}}";
    return url;
  }
});

Template.gamesessionPreview.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var gamesessionId = FlowRouter.getParam('gamesessionId');
    self.subscribe('singleGamesession', gamesessionId);
  });
});
