Batch.Router.map(function() {
	this.route('login');

  		this.resource('recipes', function(){
  			this.route('create');
  		});
  		
  		this.route('my-recipes');
		this.route('public-recipes');
		this.route('popular-recipes');
		this.route('my-favorite-recipes');
		this.route('my-pantry');	
		
});





    