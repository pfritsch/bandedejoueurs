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
          template: 'email_event',
          absoluteUrl: Meteor.absoluteUrl('', {secure: true}),
          subject: TAPi18n.__('emailGamesessionJoinSubject', this.title),
          title: TAPi18n.__('emailGamesessionJoinTitle', getName(Meteor.user())),
          subtitle: this.title+' '+formatDate(this.meetingDate),
          rdv: TAPi18n.__('emailGamesessionRDV'),
          rdvDate: TAPi18n.__('helper.onDate', moment(this.meetingDate, 'X').format('LLLL')),
          rdvLocation: formatLocation(this.meetingPlace),
          callToActionUrl: FlowRouter.url('playerDetail', {userId: this._id}),
          callToAction: TAPi18n.__('gamesessionDetailSee'),
          ciao: TAPi18n.__('emailCiao'),
          followUs: TAPi18n.__('emailFollowUs'),
          feedback: TAPi18n.__('emailFeedback')
        };
        Meteor.call('sendUserEmail', emailData);

        // Send email to author
        var author = Meteor.users.findOne(this.authorId);
        var emailData = {
          template: 'email_simple',
          absoluteUrl: Meteor.absoluteUrl('', {secure: true}),
          subject: TAPi18n.__('emailGamesessionJoinSubject', this.title),
          title: TAPi18n.__('emailGamesessionNewplayerTitle', getName(author)),
          subtitle: this+' '+formatDate(this.meetingDate),
          text: TAPi18n.__('emailGamesessionNewplayerText'),
          callToActionUrl: FlowRouter.url('playerDetail', {userId: Meteor.userId()}),
          callToAction: TAPi18n.__('playerDetailSee'),
          ciao: TAPi18n.__('emailCiao'),
          followUs: TAPi18n.__('emailFollowUs'),
          feedback: TAPi18n.__('emailFeedback')
        };
        Meteor.call('sendPlayerEmail', emailData, this.authorId);
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
