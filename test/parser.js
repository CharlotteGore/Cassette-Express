	var should = require('should');


	describe('using the reference parser', function(){

		var parser = require('../lib/referenceParser.js')();


		describe('with javascript style references', function(){

			it('can get a single reference from a single line', function(){

				var references = parser.getReferences('// @reference other.js');

				references.should.be.an.instanceOf(Array);
				references.should.eql(['other.js']);

			});

			it('can get multiple references on a single line', function(){

				var references = parser.getReferences('// @reference other.js lib/jquery lib/underscore');

				references.should.eql(['other.js','lib/jquery','lib/underscore']);


			});

			it('can get multiple references on multiple lines', function(){

				var references = parser.getReferences('// @reference other.js\n   // @reference lib/jquery    lib/base \n// @reference lib/underscore\n');

				references.should.eql(['other.js','lib/jquery','lib/base','lib/underscore']);

			});

			it('can get references wrapped in single and double quotes', function(){

				var references = parser.getReferences('// @reference other.js\n   // @reference \'lib/jquery\'   lib/base \n// @reference "lib/underscore"\n');

				references.should.eql(['other.js','lib/jquery','lib/base','lib/underscore']);

			});

			it('returns no results when there are no references', function(){

				var references = parser.getReferences(' // Hello im just a normal comment\n//I have no references\n//Gee, I hope this doesnt break\n');

				references.should.eql([]);

			});

		});

		describe('with xml style references', function(){

			it('can get a single reference from a single line', function(){

				var references = parser.getReferences('/// <reference path="other.js" />');

				references.should.be.an.instanceOf(Array);
				references.should.eql(['other.js']);

			});

			it('can get references on multiple lines', function(){

				var references = parser.getReferences('/// <reference path="other.js" /> \n/// <reference path="lib/base" />\n/// <reference path="lib/jquery" />\n\n /// <reference path="lib/underscore" /> \n');

				references.should.eql(['other.js','lib/base','lib/jquery','lib/underscore']);

			});


		});

	})