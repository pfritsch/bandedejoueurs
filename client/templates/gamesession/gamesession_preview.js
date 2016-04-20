Template.gamesessionPreview.helpers({
  gamesession: function() {
    var user = Meteor.user();
    var gamesessionId = FlowRouter.getParam('gamesessionId');
    var gamesession = Gamesessions.findOne({_id: gamesessionId}) || {};
    if(user && user._id === gamesession.authorId){
      var sendMail = FlowRouter.getQueryParam("sendMail");
      if(sendMail) {
        var rdvDate = TAPi18n.__('helper.onDate', moment(gamesession.meetingDate, 'X').format('LLLL'));
        var rdvLocation = formatLocation(gamesession.meetingPlace);
        var emailData = {
          title: TAPi18n.__('emailCongrats', getName(user)),
          subtitle: formatTitle(gamesession)+' '+formatDate(gamesession.meetingDate),
          text: TAPi18n.__('emailGamesessionSendLink'),
          url: 'http://localhost:3000/gamesessions/'+gamesessionId,
          rdv: TAPi18n.__('emailGamesessionRDV'),
          rdvDate: rdvDate,
          rdvLocation: rdvLocation,
          callToActionUrl: 'http://localhost:3000/gamesessions/'+gamesessionId,
          callToAction: TAPi18n.__('gamesessionDetailSee'),
          ciao: TAPi18n.__('emailCiao'),
          followUs: TAPi18n.__('emailFollowUs'),
          feedback: TAPi18n.__('emailFeedback')
        };
        Meteor.call('emailGamesessionConfirm', emailData);
        FlowRouter.setQueryParams({sendMail:null});
      }
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