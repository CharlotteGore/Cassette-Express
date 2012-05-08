var base = require('base-framework'),
	_ = require('underscore');


var Assembly = base.createChild().addInstanceMethods({

	init : function( assets ){

		this.assets = assets;

		return this;

	},

	getDebugTags : function(){


	},

	getTag : function(){


	}

});


exports = module.exports = Assembly;