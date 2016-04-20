Template.avatar.helpers({
  userColor: function(){
    var username = getName(this.user);
    if(username) return hashStringToColor(username);
  }
});
