Template.playerList.helpers({
  allPlayers: function() {
    return Meteor.users.find({ _id: {$ne: Meteor.userId()} }, {sort: {createdAt: -1}});
  },
  currentUser:function() {
    return Meteor.user();
  }
})

Template.playerList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    SEO.set({
      title: 'Bande de joueurs | '+TAPi18n.__('playerDetailallPlayers')
    });
    Meteor.subscribe('somePlayers', {});
  });
});
