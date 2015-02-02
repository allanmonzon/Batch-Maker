Batch.RecipesRecipeController = Ember.ObjectController.extend({
  needs: 'application',
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  isAuthor: function(){
    if (this.get('currentUser.id') === this.get('author.id')) {
      return true;
    }
    else
      return false;
  }.property('currentUser'),
  actions: {
    editRecipe: function() {
      this.transitionToRoute("recipes.edit");
    }
  }
});