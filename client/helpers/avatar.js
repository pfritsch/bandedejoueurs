Template.avatar.helpers({
  userColor: function(){
    if('username' in this) {
      return hashStringToColor(this.username);
    }
  }
});
