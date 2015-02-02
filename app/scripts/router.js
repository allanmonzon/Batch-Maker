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











    