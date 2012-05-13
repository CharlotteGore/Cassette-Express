var base = require('base-framework'),
	_ = require('underscore'),
	Manifest = require('./manifest.js');

// some defaults for an Express environment.
var assetsPath = process.env.PWD + '/public/javascripts/';
var outputPath = '/javascripts/';


var cassette = base.createChild().addInstanceMethods({

	init : function( config ){

		if(config.assetsPath){

			assetsPath = config.assetsPath;

		}

		if(config.outputPath){

			outputPath = config.outputPath;

		}else {

			outputPath = '';

		}

		if(config.mode){

			this.mode = config.mode;

		}else{

			this.mode = 'debug';

		}

		this.manifest = Manifest(assetsPath);
		this.assemblies = {};

		return this;

	},

	middleware : function(){

		var self = this;

		return {

			useAsset : function( asset ){

				var str;

				if(self.mode==='debug'){

					str = self.manifest.getAssembly( asset, 'forceCheck' ).getDebugTags( outputPath );

				} else {

					str = self.manifest.getAssembly( asset ).getTag( outputPath );

				}

				return str;

			}

		};

	}

});


exports = module.exports = cassette;