Template.layoutDefault.events({
  'click [data-collapse]': function(e, tpl, doc) {
    var myTarget = tpl.$(e.currentTarget).attr('data-collapse');
    myTarget = tpl.$('.'+myTarget);
    if (myTarget.length) {
      myTarget.toggleClass('is-open').addClass('is-moving');
      setTimeout(function(){
        myTarget.removeClass('is-moving');
      }, 300);
    }
  },
  'click .nav-off a': function(e, tpl, doc) {
    myTarget = $('.nav-off');
    if (myTarget.length) {
      myTarget.removeClass('is-open');
    }
  },
  'click .my-profil-logout, click .logout': function(){
    AccountsTemplates.logout();
  },
  'click .goback': function(e) {
    e.preventDefault();
    history.back();
  }
});
