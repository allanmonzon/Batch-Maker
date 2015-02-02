Batch.RecipesNewRoute = Ember.Route.extend({
  beforeModel: function() {
    var currentUser = this.controllerFor('application').get('currentUser');
    if (!currentUser) {
      this.transitionTo('index');
    }
  }
});
