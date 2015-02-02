Batch.User = DS.Model.extend({
	username: DS.attr('string'),
	recipes: DS.hasMany('recipe', {async: true}),
	email: DS.attr('string')
});	







	
