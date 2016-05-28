// Functions
function activeRoute(newPage) {
  FlowRouter.watchPathChange();
  var active = _.any(newPage, function(name) {
    return FlowRouter.current().route.name === name
  });
  return active && 'is-current';
}

// Nav Lang
Template.navLang.events({
  'click [data-lang]': function(e, tpl, doc) {
    e.preventDefault();
    var newLang = $(e.currentTarget).attr('data-lang');
    localStorage.setItem('userLocale', newLang);
    Session.set('lang', newLang);
    T9n.setLanguage(newLang);
    TAPi18n.setLanguage(newLang);
    moment.locale(newLang);
    if(Meteor.user()){
      Meteor.call('userEditLang', newLang);
    }
  }
});

// Nav Off
Template.navOff.helpers({
  activeRouteClass: function(){
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop()
    return activeRoute(args);
  }
});
Template.navOff.events({
  'click .nav-off a': function(e, tpl, doc) {
    myTarget = $('.nav-off');
    if (myTarget.length) {
      myTarget.removeClass('is-open');
    }
  }
});

// Nav Main
Template.navMain.helpers({
  activeRouteClass: function(){
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();
    return activeRoute(args);
  }
});

// Nav Tabs
Template.navTabs.helpers({
  hasNewMessage: function(){
    var messages = Meteor.user().messages;
    if(messages) {
      return messages.contains("status", "new") > -1;
    }
  }
});
