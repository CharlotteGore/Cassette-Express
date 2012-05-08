var parser = require('base-framework').createChild(),
	_ = require('underscore'),

	xmlRegex = /([\s]+|)\/\/\/([\s]+|)<reference path="([\.\/a-zA-Z0-9_\-]+)" \/>([\s]+|)/,
	jsRegex = /^([\s]+|)\/\/([\s]+|)@reference\s([\'\"\.\/a-zA-Z0-9_\-\s]+)$/;


parser.addInstanceMethods({

	init : function( fails ){ // undocumented feature! You can specify how many non-reference lines the parser will tolerate before giving up.

		if(typeof fails !== 'undefined'){

			this.maxFails = fails;

		} else {

			this.maxFails = 2;

		}

		return this;		

	},

	getReferences : function( src ){

		var lines = src.split(/\n/g), 
			references = [], 
			matches, 
			fails = 0, 
			index = 0;

		while(fails < this.maxFails && typeof lines[index] === 'string'){

			matches = (lines[index].match(jsRegex));

			if(!matches){

				matches = (lines[index].match(xmlRegex));


			}

			if(matches){

				_.each(matches[3].split(/\s/g), function(ref){

					if(ref!==''){
						references.push( (ref.replace(/\'/g, '')).replace(/\"/g, '') );
					}

				});



			} else {

				fails++;

			}

			index++;

		}

		return references;

	}

})

exports = module.exports = parser;