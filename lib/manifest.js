var base = require('base-framework'),
	fs = require('fs'),
	_ = require('underscore'),
	Asset = require('./asset.js'),
	Assembly = require('./assembly.js'),
	Manifest;


// Here is the Bundle object.
var Manifest = base.createChild().addInstanceMethods({

	init : function( assetsPath ){

		this.assetsPath = assetsPath;

		this.bundleIndex = {};
		this.assetIndex = {};

		//this.assets = [];

		this.bundleDependencies = [];
		this.externalFileDependencies = [];

		this.scanDirectory('');

		return this;

	},

	// the the files
	scanDirectory : function( currentPath ){
	
		var files = fs.readdirSync(this.assetsPath + currentPath);

		if(!this.bundleIndex[currentPath]){

			this.bundleIndex[currentPath] = {
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

					this.assetIndex[ asset.name ] = asset;
					this.bundleIndex[ currentPath ].files.push( asset.name );

				}


			}else if(stat.isDirectory()){

				this.bundleIndex[currentPath].bundles.push(currentPath + '/' + file);
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

		var filesGot = {};
		var filesNeeded = {};
		var filesThatNeedFiles = {};

		// if it's a file...
		if(this.assetIndex[key]){

			// get the file requested...
			first = this.assetIndex[key];

			// add it to 'got'
			filesGot[first.name] = first;

			if(_.isEmpty(first.fileDependencies()) && _.isEmpty(first.bundleDependencies()) ){
				// early exit: Assembly is a single file without dependences. We're done!
				return Assembly(filesGot);

			}
		// else if it's a directory we know about..
		}else if(this.bundleIndex[key]){

			// get all the files from the directory requested (and the sub directories)
			filesGot = this.getFilesFromBundle(key);

		// or we throw up.
		}else{

			throw new Error('No such asset: No files or directories found matching ' + key);

		}

		// now we get all the other dependencies there may be...


		// TODO: THe magic that makes this shit work. 



		// and we're done...
		return Assembly(filesGot);


	},

	updateFileLists : function(got, needed){

		_.each(got, function( file  ){


		})

	},

	getFilesFromBundle : function( key ){

		var self = this, assets = (function getList(id){

			var files = self.bundleIndex[id].files.slice(0); // get the files

			_.each(self.bundleIndex[id].bundles, function(bundle){

				files = files.concat( getList( bundle ) );

			}, this);

			return files;

		}(key)), list = [];

		_.each(assets, function( asset ){

			if(this.assetIndex[asset]){

				list[this.assetIndex[asset].name] = this.assetIndex[asset];

			}else{

				throw new Error('No such asset referenced by file: ' + asset);

			}

		}, this)

		return list;

	},

	// unit testing helper..
	query : function(){

		return this.bundleIndex;

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