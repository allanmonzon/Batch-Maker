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
Batch.Router.map(function() {
	this.resource('recipes', function(){
		this.route('new');
		this.route('recipe', {path: '/:recipe_id'});
		this.route('edit', {path: '/:recipe_id/edit'});
		this.route('my');
		this.route('public');
		this.route('popular');
		this.route('favorites');
		this.route('pantry');
	});		
});











    
Batch.NewRecipeWorkflow = Ember.Object.extend({
  fetchAuthor: function() {
    var self = this;
    return this.store.find('user', this.authorID)
      .then(function(author) {
        self.set('author', author);
      });
  },

  saveIngredients: function() {
    var self = this;
    this.ingredients.forEach(function(ingredient) {
      ingredient.save();
      self.get('recipe.ingredients').addObject(ingredient);
      self.get('recipe').save();
    });
    return this.get('recipe.id');
  },

  makeRecipe: function() {
    var config = Ember.merge({
      author: this.author,
    }, this.attributes);
    this.set('recipe', this.store.createRecord('recipe',config));
    var recipe = this.get('recipe');
    this.get('steps').forEach(function(step){
      recipe.get('steps').addObject(step);
    });
    return this.get('recipe').save();
  },

  addRecipeToAuthor: function() {
    this.get('author.recipes').addObject(this.get('recipe'));
    return this.get('author').save();
  },

  addRecipeToPublic: function() {
    var self = this;
    if (this.get('recipe.isPublic')) {
      var publicRecipe = this.store.find('publicRecipe', 'all')
        .then(function(collection) {
          collection.get('recipes').addObject(self.get('recipe'));
          return publicRecipe.save;
      });
    }
  },

  run: function() {
    return this.fetchAuthor()
      .then(this.makeRecipe.bind(this))
      .then(this.addRecipeToAuthor.bind(this))
      .then(this.addRecipeToPublic.bind(this))
      .then(this.saveIngredients.bind(this));
  }
});
Batch.User = DS.Model.extend({
	username: DS.attr('string'),
	recipes: DS.hasMany('recipe', {async: true}),
	email: DS.attr('string')
});	







	

Batch.Recipe = DS.Model.extend({
	author: DS.belongsTo('user'),
  name: DS.attr('string'),
  isPublic: DS.attr('boolean'),
  yieldCount: DS.attr('number'),
  yieldUnit: DS.attr('string'),
  recipeType: DS.attr('string'),
  imgURL: DS.attr('string'),
  prepTime: DS.attr('number'),
  prepTimeUnit: DS.attr('string'),
  cookTime: DS.attr('number'),
  cookTimeUnit: DS.attr('string'),
  cookTemp: DS.attr('number'),
  cookTempUnit: DS.attr('string'),
  steps: DS.hasMany('step', {embedded: true}),
  notes: DS.attr('string')
});	


Batch.Step = DS.Model.extend({
  stepNum: DS.attr('number'),
  description: DS.attr('string'),
});

Batch.PublicRecipe = DS.Model.extend({
  recipes: DS.hasMany('recipe', {async: true})
});
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
Batch.IndexController = Ember.Controller.extend({
  needs: 'application',
  isLoggedIn: Ember.computed.alias('controllers.application.isLoggedIn'),
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  actions: {
    signup: function(){
      var self = this;
      var credentials = this.getProperties('email', 'password', 'username');

      Batch.ref.createUser(credentials, function(error){
        if (!error) {
          self.get('controllers.application').authenticate(credentials)
          .then(function (user) {
            user.setProperties ({
              username: credentials.username,
              email: credentials.email
            });
            user.save();
            self.transitionToRoute('recipes');
          });
        } else {
          console.log(error);
        }
      });
    },

    login: function() {
      var self = this;
      var credentials = this.getProperties('email', 'password');
      var user = this.get('controllers.application.currentUser');
      this.get('controllers.application').authenticate(credentials).then(function(){
        var user = self.get('controllers.application.currentUser');
        self.transitionToRoute('recipes');
      });
    },
  }
});

Batch.RecipesController = Ember.Controller.extend({
  actions: {
    logout: function() {
      this.set('currentUser', '');
      localStorage.removeItem('batch-firebase-token');
      Batch.ref.unauth();
      this.transitionToRoute('index');
    }
  }
});
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
Batch.RecipesMyRoute = Ember.Route.extend({
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
      controller.set('myRecipes', myRecipes.slice(-50));
    });
  }, 
});
Batch.RecipesNewRoute = Ember.Route.extend({
  beforeModel: function() {
    var currentUser = this.controllerFor('application').get('currentUser');
    if (!currentUser) {
      this.transitionTo('index');
    }
  }
});
