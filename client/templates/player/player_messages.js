Template.playerMessages.helpers({
  player: function() {
    var userId = FlowRouter.getParam('userId');
    var player = Meteor.users.findOne(userId) || {};
    return player;
  },
  'playerName': function() {
    return this.profile.name || this.username;
  },
  'userColor': function(pUsername){
    return hashStringToColor(pUsername);
  },
  'messagesFromPlayer': function() {
    var playerId = this._id;
    var playerMessages = Meteor.user().messages.filter(function(msg){
      if ('playerId' in msg && msg.playerId === playerId) {
        return true;
      } else {
        return false;
      }
    });

    // mark as read
    Meteor.call('userReadMessage', playerId);

    return playerMessages.sort(function(x, y){
      return y.date - x.date;
    })
  },
  'onlyFromUser': function() {
    var playerId = this._id;
    var messagesFromPlayer = Meteor.user().messages.filter(function(msg){
     if ('playerId' in msg && msg.playerId === playerId && !msg.fromUser) {
       return true;
     } else {
       return false;
     }
    });
    return Meteor.user().messages.length > 0 && messagesFromPlayer.length <= 0;
  },
  'dateFormatted': function() {
    return moment(this.date, 'X').fromNow();
  }
});

Template.playerMessages.events({
  'submit #message': function(e){
    e.preventDefault();
    var text = e.target.playerMessage.value;
    if(text != '') {
      Meteor.call('userSendMessage', this._id, text);
      e.target.playerMessage.value = ''
    }
  }
});

Template.playerMessages.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var userId = FlowRouter.getParam('userId');
    self.subscribe('somePlayers', { _id: userId });
  });
});
