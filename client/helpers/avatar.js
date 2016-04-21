Template.avatar.helpers({
  userColor: function(){
    if(this.user){
      var username = getName(this.user);
      if(username) return hashStringToColor(username);
    }
  }
});
