Batch.LoginController = Ember.ArrayController.extend({
	needs: ['application'],

	actions: {
		logIn: function(){
			 var credentials = this.getProperties('email', 'password');
      this.get('controllers.application').authenticate(credentials);
		}
	}

});