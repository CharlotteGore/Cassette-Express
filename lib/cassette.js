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

		}

		if(config.mode){

			this.mode = config.mode;

		}else{

			this.mode = 'debug';

		}

		this.manifest = Manifest(assetsPath);

		return this;

	},

	getAsset : function( asset ){

		if(!this.assemblies[asset]){

			this.assemblies[asset] = Assembly( asset, this.manifest );

		}else{

			if(this.manifest.assetsChanged()){

				this.assemblies[asset].reassemble();

			}

			return this.assemblies[asset].bundle();

		}
		/*
		var unsorted = {}, assembly = [], noDependencies = [], d = 0;

		var time = (new Date()).getTime();

		var getExternalBundles = function( name ){

			if(!bundles[ name ].processed){

				processBundle( name );

			}

			_.each(bundles[ name ].files, function(file){
				
				unsorted[file.path + file.name] = file;

			})

			if(!_.isEmpty(bundles[ name ].bundles)){

				_.each(bundles[name].bundles, function(bundle, index){

					getExternalBundles(index);


				});

			}

		};

		var collapseTheBundles = function(){

			_.each(unsorted, function(asset, name){

				if(!_.isEmpty(asset.dependencies.bundles)){

					_.each(asset.dependencies.bundles, function(bundle){

						_.each(bundles[bundle].files, function(file){
				
							asset.dependencies.files.push( file.path + file.name );

						})

					})

				}

				_.each(asset.dependencies.files, function(file, index){

					asset.dependencies.files[index] = file;

				})

			});

		};



		if(bundles[bundleName]){

			if(!bundles[bundleName].assembly){

				getExternalBundles(bundleName);
				collapseTheBundles();
				bundles[bundleName].assembly = sortBundle( unsorted );
			}

			return  bundles[bundleName].assembly;

		
		}else{

			throw('no such bundle');

		}

		*/

	},

	middleware : function(){

		var self = this;

		return {

			useAsset : function( asset ){

				var manifest = self.getAsset( asset );
				var str = '';

				_.each(manifest, function(item){

					str+="<script type='text/javascript' src='" + outputPath + item.name + "'></script>";

				});

				return str;

			}

		};

	}

});


exports = module.exports = cassette;