Batch.RecipesIndexRoute = Ember.Route.extend({
  beforeModel: function(){
    var currentUser = this.controllerFor('application').get('currentUser');
    if (!currentUser) {
      this.transitionTo('index');
    }
  },

  setupController: function(controller, model) {
    var myRecipes = this.controllerFor('application')
      .get('currentUser.recipes');
    myRecipes.then(function() {
      controller.set('myRecipes', myRecipes.slice(-4));
    });
  } 
});