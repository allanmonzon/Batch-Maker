Batch.ApplicationController = Ember.Controller.extend({
  currentUser: null,

  authenticate: function(credentials) {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Batch.ref.authWithPassword(credentials, function(error, authData) {
        self.configureSession(authData).then(resolve, reject);
      });
    });
  },

  configureSession: function(authData) {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
      localStorage.setItem('batch-firebase-token', authData.token);
      self.store.find('user', authData.uid).then(function(user){
        self.set('currentUser', user);
        resolve(user);
      }, function(error){
        var user = self.store.recordForId('user', authData.uid);
        user.loadedData();
        self.set('currentUser', user);
        resolve(user);
      });
    });
  },

  authWithToken: function(token) {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Batch.ref.authWithCustomToken(token, function(error, authData) {
        self.configureSession(authData).then(resolve, reject);
      });
    });
  },

});