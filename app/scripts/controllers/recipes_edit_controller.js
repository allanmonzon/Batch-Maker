Batch.RecipesEditController = Ember.ObjectController.extend({
  timeUnits: ["mins", "hrs"],
  recipeTypes: ["breakfast", "lunch", "dinner", "dessert"],
  tempUnits: ["Farenheit", "Celcius"],

  actions: {
    addPic: function() {
      var self = this;
      filepicker.setKey("AbaVivMnhQ0G6kwM930sKz");
      filepicker.pickAndStore({},{},function(Blobs){
        self.set('imgURL', Blobs[0].url);
      });
    },

    saveRecipe: function() {
      this.model.save();
      this.transitionToRoute('recipes.recipe', this.get('id'));
    },

    addStep: function() {
      console.log(this.get('steps.content'));
      var stepNum = this.get('steps.content').length + 1;
      var newStep = this.store.createRecord('step', {
        stepNum: stepNum,
      });
      this.get('steps').addObject(newStep);
    }
  }
});


Batch.StepEditController = Ember.ObjectController.extend({
  isEditing: true,

  actions: {
    addIngredient: function() {
      var newIngredient = this.store.createRecord('ingredientFood');
      this.get('ingredients').addObject(newIngredient);
    },

    saveStep: function() {
      this.set('isEditing', false);
      this.get('parentController.steps').addObject(this.get('model'));
    },

    editStep: function() {
      this.set('isEditing', true);
    }
  }
});