var base = require('base-framework'),
	_ = require('underscore');


var Assembly = base.createChild().addInstanceMethods({

	init : function( assets ){

		this.assets = assets;

		this.length = 0;

		_.each(this.assets, function(){

			this.length++;

		}, this);

		this.debugTags = '';
		this.tag = '';

		return this;

	},

	getDebugTags : function( outputPath ){

		if(this.debugTags === ''){

			_.each(this.assets, function( asset ){

				this.debugTags += "<script type='text/javascript' src='" + outputPath + asset.name + "'></script>"

			}, this)

		}

		return this.debugTags;

	},

	getTag : function(){

		return '<script></script>';


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