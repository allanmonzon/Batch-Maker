Batch.RecipesNewController = Ember.Controller.extend({
  needs: 'application',
  timeUnit: ["mins", "hrs"],
  recipeType: ["breakfast", "lunch", "dinner", "dessert"],
  selectedRecipe: null,
  tempUnit: ["Farenheit", "Celcius"],
  selectedCookTempUnit: "Farenheit",
  author: Ember.computed.alias('controllers.application.currentUser'),
  ingredients: [],
  steps: [],
  isPublic: false,
  imgURL: '',
  actions: {
    addPic: function() {
      var self = this;
      filepicker.setKey("AbaVivMnhQ0G6kwM930sKz");

      filepicker.pickAndStore({},{},function(Blobs){
        self.set('imgURL', Blobs[0].url);
      });
    },
    saveRecipe: function() {
      var self=this;
      var workflow = Batch.NewRecipeWorkflow.create({
        attributes: {
          name: this.name,
          isPublic: this.get('isPublic'),
          recipeType: this.get('selectedRecipeType'),
          prepTime: this.get('prepTime'),
          prepTimeUnit: this.get('selectedPrepTimeUnit'),
          cookTime: this.get('cookTime'),
          cookTimeUnit: this.get('selectedCookTimeUnit'),
          cookTemp: this.get('cookTemp'),
          cookTempUnit: this.get('selectedCookTempUnit'),
          yieldCount: this.get('yieldCount'),
          yieldUnit: this.get('yieldUnit'),
          notes: this.get('notes'),
          imgURL: this.get('imgURL')
        },
        ingredients: this.get('ingredients'),
        steps: this.get('steps'),
        store: this.get('store'),
        authorID: this.get('author.id')
      });
      workflow.run().then(function(id) {
        self.transitionToRoute('recipes.recipe', id);
      });
    },
    addStep: function() {
      var stepNum = this.get('steps').length + 1;
      var newStep = this.store.createRecord('step', {
        stepNum: stepNum,
      });
      this.get('steps').addObject(newStep);
    }
  }
});

Batch.StepController = Ember.ObjectController.extend({
  isEditing: true,
  actions: {
    saveStep: function() {
      this.set('isEditing', false);
      this.get('parentController.steps').addObject(this.get('model'));
    },
    editStep: function() {
      this.set('isEditing', true);
    }
  }
});








