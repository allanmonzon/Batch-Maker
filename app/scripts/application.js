(function(){
  'use strict';

  window.Batch = Ember.Application.create({
  	LOG_TRANSITIONS: true
  });

  Batch.ref = new Firebase("https://batch-maker-1.firebaseio.com");

  Batch.ApplicationAdapter = DS.FirebaseAdapter.extend({
    firebase: Batch.ref
  });


  Batch.initializer({
    name: 'firebase-session',

    initialize: function(container, application){
      application.deferReadiness();
      var token = localStorage.getItem('batch-firebase-token');
      if (token) {
        var session = container.lookup('controller:application');
        session.authWithToken(token).then(function(){
          application.advanceReadiness();
        });
      } else {application.advanceReadiness();}
    }
  });
})();