Batch.IndexController = Ember.Controller.extend({
  needs: 'application',
  isLoggedIn: Ember.computed.alias('controllers.application.isLoggedIn'),
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  actions: {
    signup: function(){
      var self = this;
      var credentials = this.getProperties('email', 'password', 'username');

      Batch.ref.createUser(credentials, function(error){
        if (!error) {
          self.get('controllers.application').authenticate(credentials)
          .then(function (user) {
            user.setProperties ({
              username: credentials.username,
              email: credentials.email
            });
            user.save();
            self.transitionToRoute('recipes');
          });
        } else {
          console.log(error);
        }
      });
    },

    login: function() {
      var self = this;
      var credentials = this.getProperties('email', 'password');
      var user = this.get('controllers.application.currentUser');
      this.get('controllers.application').authenticate(credentials).then(function(){
        var user = self.get('controllers.application.currentUser');
        self.transitionToRoute('recipes');
      });
    },
  }
});

Batch.RecipesController = Ember.Controller.extend({
  actions: {
    logout: function() {
      this.set('currentUser', '');
      localStorage.removeItem('batch-firebase-token');
      Batch.ref.unauth();
      this.transitionToRoute('index');
    }
  }
});