// Useraccount Routes
AccountsTemplates.configure({
    defaultLayout: 'layoutAccount',
    defaultLayoutRegions: {
      header: "headerDefault"
    },
    defaultContentRegion: 'main'
});
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');

var publicPages = FlowRouter.group();

var privatePages = FlowRouter.group({
  triggersEnter: [
    function() {
      var user = Meteor.user();
      if (!(Meteor.loggingIn() || user)) {
        throwNotification(TAPi18n.__('errorNotUser'));
        return FlowRouter.go('/sign-up');
      }
    }
  ]
});

// Profile
privatePages.route('/profile', {
  name: 'myProfile',
    action: function() {
      BlazeLayout.render("layoutDefault", {
        main: "myProfile",
        header: "headerDefault"
      });
    }
});

// Home
publicPages.route('/', {
  name: 'home',
  action: function() {
    BlazeLayout.render("layoutDefault", {
      main: "home",
      header: "headerHome"
    });
  }
});

// Players
publicPages.route('/players', {
  name: 'playerMap',
  action: function() {
    BlazeLayout.render("layoutDefault", {
      main: "playerMap",
      header: "headerDefault"
    });
  }
});
publicPages.route('/players/all', {
  name: 'playerList',
  action: function() {
    BlazeLayout.render("layoutDefault", {
      main: "playerList",
      header: "headerDefault"
    });
  }
});
publicPages.route('/players/:userId', {
  name: 'playerDetail',
  action: function(params, queryParams) {
    BlazeLayout.render("layoutDefault", {
      main: "playerDetail",
      header: "headerDefault"
    });
  }
});

// Messages from a particular player
privatePages.route('/messages/:userId', {
  name: 'playerMessages',
  action: function(params, queryParams) {
    BlazeLayout.render("layoutDefault", {
      main: "playerMessages",
      header: "headerDefault"
    });
  }
});

// Gamesessions
publicPages.route('/gamesessions', {
  name: 'gamesessionList',
  action: function() {
    BlazeLayout.render("layoutDefault", {
      main: "gamesessionList",
      header: "headerDefault"
    });
  }
});
publicPages.route('/gamesessions/:gamesessionId', {
  name: 'gamesessionDetail',
  action: function(params, queryParams) {
    BlazeLayout.render("layoutDefault", {
      main: "gamesessionDetail",
      header: "headerDefault"
    });
  }
});
publicPages.route('/gamesession/preview/:gamesessionId', {
  name: 'gamesessionPreview',
  action: function(params, queryParams) {
    BlazeLayout.render("layoutDefault", {
      main: "gamesessionPreview",
      header: "headerDefault"
    });
  }
});
privatePages.route('/gamesession/create', {
  name: 'gamesessionCreate',
  subscriptions: function(params) {
    this.register('someGames', Meteor.subscribe('someGames', {}));
  },
  action: function() {
    BlazeLayout.render("layoutDefault", {
      main: "gamesessionCreate",
      header: "headerDefault"
    });
  }
});
privatePages.route('/gamesession/edit/:gamesessionId', {
  name: 'gamesessionEdit',
  subscriptions: function(params) {
    this.register('singleGamesession', Meteor.subscribe('singleGamesession', params.gamesessionId));
    this.register('someGames', Meteor.subscribe('someGames', {}));
  },
  action: function() {
    BlazeLayout.render("layoutDefault", {
      main: "gamesessionEdit",
      header: "headerDefault"
    });
  }
});

// Games
publicPages.route('/games', {
  name: 'games',
  action: function() {
    BlazeLayout.render("layoutDefault", {
      main: "gameList",
      header: "headerDefault"
    });
  }
});

// Not Found
FlowRouter.notFound = {
  action: function() {
    return FlowRouter.go('home');
  }
};
