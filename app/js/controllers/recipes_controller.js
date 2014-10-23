Batch.RecipesCreateController = Ember.ArrayController.extend({

  needs: ['application'],

  actions: {
    createRecipe: function() {
      var batch = this.store.createRecord('recipe', {
        recipeName: this.get('recipeName'),
        user: this.get('recipeUser'),
        yieldNumber: this.get('yieldNumber'),
        yieldName: this.get('yieldName') 
      });
      
      batch.save();
      this.set('recipeName', '');
      this.set('recipeUser', '');
      this.set('yieldNumber', '');
      this.set('yieldName', '');
    }
  }

});
