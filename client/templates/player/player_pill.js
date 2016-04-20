Template.myProfile.helpers({
  userDisplayName: function(){
    if(this.profile && this.profile.name) return this.profile.name;
    return this.username;
  }
});
