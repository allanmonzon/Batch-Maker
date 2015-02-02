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