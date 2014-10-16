window.Batch = Ember.Application.create();

Batch.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: new Firebase("https://blistering-fire-990.firebaseio.com")
});
