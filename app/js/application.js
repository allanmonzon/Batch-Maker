window.Batch = Ember.Application.create();

Batch.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: new Firebase("https://batch-maker-1.firebaseio.com")
});
