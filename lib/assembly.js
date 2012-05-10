var base = require('base-framework'),
	_ = require('underscore');


var Assembly = base.createChild().addInstanceMethods({

	init : function( assets ){

		this.assets = assets;

		this.length = 0;

		_.each(this.assets, function(){

			this.length++;

		}, this);

		return this;

	},

	getDebugTags : function(){


	},

	getTag : function(){


	},

	query : function(){

		var list = [];

		_.each(this.assets, function(asset){

			list.push(asset.name);

		});

		return list;

	}



});


exports = module.exports = Assembly;