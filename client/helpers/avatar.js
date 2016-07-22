Template.avatar.helpers({
  userColor: function(){
    return hashStringToColor(getName(this));
  }
});
