// @reference 1.js 2.js ../SomeOtherThing

(function(a, b, something){

	var c = b + a + 10;

	window.c = c;
	window.stuff = 'I added this to: ' + something;

}(a, b, something));