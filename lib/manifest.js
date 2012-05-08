var base = require('base-framework'),
	fs = require('fs'),
	_ = require('underscore'),
	Asset = require('./asset.js'),
	Assembly = require('./assembly.js'),
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

	createAssembly : function( key ){

		// optimse for early exit for single JS file without dependencies;

		var first;

		var filesGot = [];
		var filesNeeded = [];
		var filesThatNeedFiles = [];

		if(assetIndex[key]){

			first = assetIndex[key];

			filesGot.push(first);

			if(_.isEmpty(first.fileDependencies()) && _.isEmpty(first.bundleDependencies()) ){

				// early exit: Assembly is a single file without dependences
				return Assembly(filesGot);

			}else{

				throw new Error('File depencencies not supported yet');

			}

		}else if(bundleIndex[key]){

			// collapse the bundles.
			throw new Error('Bundles not supported yet');

		}else{

			throw new Error('No such asset: No matching files or directories found.');

		}

		return([assetIndex[key]]);


	},

	query : function(){

		return bundleIndex;

	}
});

exports = module.exports = Manifest;



/*

	F = files we have.
	L = list of files for which we don't have the files it depends on

	foreach file f in F
		foreach dependency d in f
			if d not in F 
				push f into L			

	while(L is non empty){
	
	


	}

	get(a.js)

		-> put a in F
		-> populateL. a depends on b and c. We don't have b or c in F so a goes in L
		-> while(L not empty)
			-> for each n in L
				for each dependency d in n
					add d to L


*/