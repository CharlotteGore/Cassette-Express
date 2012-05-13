// @reference ./app-namespace.js ./Features 

(function(myNamespace, secret){

	var app = new myNamespace();
	app.init();
	app.hello();

}(myNamespace, secret))