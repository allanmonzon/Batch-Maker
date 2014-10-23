Batch.UserController = Ember.Controller.extend({

  needs: ['application'],

  actions: {
    createUser: function(){
      var credentials = this.getProperties('email', 'password');
      var self = this;
      Batch.ref.createUser(credentials, function(error){
        if( ! error ){
          self.get('controllers.application').authenticate(credentials).then(function(authData){
            var user = self.store.createRecord('users', {
              id: authData.uid,
              email: credentials.email
            });
            user.save();
          });
        }
      });
    }
  }
});