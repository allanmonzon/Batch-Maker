// Users
Batch.Users = DS.Model.extend({
	username: DS.attr('string'),
	recipes: DS.hasMany('recipe'),
});	
	

// Recipe	
Batch.Recipe = DS.Model.extend({
	recipeName: DS.attr('users'),
	user: DS.belongsTo('string'),
	yieldNumber: DS.attr('number'),
	yieldName: DS.attr('string')
});	
	

// Food	
Batch.Food = DS.Model.extend({
	name: DS.attr('string')
});	
	

// Ingredient Food	
Batch.IngredientsFood = DS.Model.extend({
	ingredientAmount: DS.attr('number'),
	measurementUnit: DS.attr('string'),
	food: DS.belongsTo('food')
});	
	

// Pantry Food	
Batch.PantryFood = DS.Model.extend({
	quantity: DS.attr('number'),
	food: DS.belongsTo('food')
});	
