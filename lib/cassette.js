var base = require('base-framework'),
	_ = require('underscore'),
	Manifest = require('./manifest.js');

// some defaults for an Express environment.
var assetsPath = './public/javascripts/';
var nodeModulesPath = './node_modules';
var outputPath = '/javascripts';
var nodeModules = '/node_modules';
var buildPath = './public/javascripts/cassette';


var cassette = base.createChild().addInstanceMethods({

	init : function( config ){

		if(config){

			if(config.assetsPath){

				assetsPath = config.assetsPath;

			}

			if(config.outputPath){

				outputPath = config.outputPath;

			}

			if(config.buildPath){

				buildPath = config.buildPath;

			}		

			if(config.mode){

				this.mode = config.mode;

			}

			if(config.nodeModules){

				nodeModules = config.nodeModules;

			}


		} else {

			this.mode = 'debug';

		}

		this.manifest = Manifest(assetsPath, outputPath, nodeModules);
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