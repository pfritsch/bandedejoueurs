Template.gamesessionActions.helpers({
  isAuthor: function() {
    return this.authorId === Meteor.userId();
  },
  isRegistered: function() {
    if(this.players) return this.players.indexOf(Meteor.userId()) >= 0;
  },
  isFull: function() {
    if(this.spots) return (this.spots - this.players.length) <= 0;
  }
});

Template.gamesessionActions.events({
  'click .gamesession-join': function (e) {
    e.preventDefault();
    if(checkUser() && this.players.indexOf(Meteor.userId()) < 0) {
      try {
        Meteor.call('joinGamesession', this._id);
      } catch (e) {
        throwNotification(e);
      } finally {

        // Send email to new player
        var emailData = {
          subject: TAPi18n.__('emailGamesessionJoinSubject', this.title),
          title: TAPi18n.__('emailGamesessionJoinTitle', getName(Meteor.user())),
          subtitle: formatTitle(this)+' '+formatDate(this.meetingDate),
          rdv: TAPi18n.__('emailGamesessionRDV'),
          rdvDate: TAPi18n.__('helper.onDate', moment(this.meetingDate, 'X').format('LLLL')),
          rdvLocation: formatLocation(this.meetingPlace),
          callToActionUrl: Meteor.absoluteUrl()+'gamesessions/'+this._id,
          callToAction: TAPi18n.__('gamesessionDetailSee'),
          ciao: TAPi18n.__('emailCiao'),
          followUs: TAPi18n.__('emailFollowUs'),
          feedback: TAPi18n.__('emailFeedback')
        };
        Meteor.call('emailGamesessionJoin', emailData);

        // Send email to author
        // var emailData = {
        //   subject: TAPi18n.__('emailGamesessionJoinSubject', this.title),
        //   title: TAPi18n.__('emailGamesessionJoinTitle', getName(Meteor.user())),
        //   subtitle: formatTitle(this)+' '+formatDate(this.meetingDate),
        //   rdv: TAPi18n.__('emailGamesessionRDV'),
        //   rdvDate: TAPi18n.__('helper.onDate', moment(this.meetingDate, 'X').format('LLLL')),
        //   rdvLocation: formatLocation(this.meetingPlace),
        //   callToActionUrl: Meteor.absoluteUrl()+'gamesessions/'+this._id,
        //   callToAction: TAPi18n.__('gamesessionDetailSee'),
        //   ciao: TAPi18n.__('emailCiao'),
        //   followUs: TAPi18n.__('emailFollowUs'),
        //   feedback: TAPi18n.__('emailFeedback')
        // };
        // Meteor.call('emailGamesessionJoin', emailData);
      }
      FlowRouter.go('gamesessionDetail', {gamesessionId: this._id});
    }
  },
  'click .gamesession-leave': function (e) {
    e.preventDefault();
    if(Meteor.user() && this.players.indexOf(Meteor.userId()) >= 0) {
      Meteor.call('leaveGamesession', this._id);
    }
  }
});
