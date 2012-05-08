var base = require('base-framework'),
	fs = require('fs'),
	_ = require('underscore'),
	Asset = require('./asset.js'),
	Manifest;

// we keep a reference to all the bundles and all the files. 
// this is so that bundles can satisfy
var bundleIndex = {};
var assetIndex = {};

// Here is the Bundle object.
var Manifest = base.createChild().addInstanceMethods({

	init : function( assetsPath ){

		this.assetsPath = assetsPath;

		// these repre
		this.assets = [];

		this.bundleDependencies = [];
		this.externalFileDependencies = [];

		this.scanDirectory('');

		return this;

	},

	// the the files
	scanDirectory : function( currentPath ){
	
		var files = fs.readdirSync(this.assetsPath + currentPath);

		if(!bundleIndex[currentPath]){

			bundleIndex[currentPath] = {
				files : [],
				bundles : [],
			};

		};

		_.each(files, function(file){

			var currentFile = this.assetsPath + currentPath + '/' + file,
			stat = fs.statSync(currentFile),
			src = '',
			dependency;

			if(stat.isFile()){

				if(/\.js$/.test(file)){

					var asset = Asset(file, currentPath, this.assetsPath );

					assetIndex[ asset.name ] = asset;
					bundleIndex[ currentPath ].files.push( asset.name );

				}


			}else if(stat.isDirectory()){

				bundleIndex[currentPath].bundles.push(currentPath + file);
				this.scanDirectory(currentPath + '/' + file);

			}


		}, this);

		return this;

	},

	assetsChanged : function(){

		// STUB: go through all the assets/directories, detect changes, refresh if necessary. 

		return false;

	},

	getAsset : function( key ){

		// STUB : 

		// if it's a directory we return all the files in the directory and subfolders

		// if it's a single file, we return [ single file ]


	},

	query : function(){

		return bundleIndex;

	}
});

exports = module.exports = Manifest;