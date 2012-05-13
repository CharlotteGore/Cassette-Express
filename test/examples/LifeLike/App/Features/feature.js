// @reference ../app-namespace.js

(function(myNamespace){

	var hello = function(){

		return 'hello';

	};

	myNamespace.prototype.hello = function(){

		return hello();

	};

	myNamespace.prototype.init = function(){

		// hey, we got 'c' form OtherLib/3.js, which is a dep of app-namespace..
		console.log(c);

	};

}(myNamespace));

