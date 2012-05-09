var base = require('base-framework'),
	path = require('path'),
	fs = require('fs'),
	_ = require('underscore'),
	Asset = require('./asset.js'),
	Assembly = require('./assembly.js'),
	Manifest;

// var m = require('./lib/manifest.js')(process.env.PWD + '/test/examples');

// Here is the Bundle object.
var Manifest = base.createChild().addInstanceMethods({

	init : function( assetsPath ){

		this.assetsPath = path.normalize(assetsPath);

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

				this.bundleIndex[currentPath].bundles.push( path.normalize(currentPath + '/' + file) );
				this.scanDirectory(path.normalize(currentPath + '/' + file));

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

		if(key){

			key = path.normalize(key);

		}

		var self = this;

		// not quite figured out what these should be at the time of writing.
		var first;
		var filesGot = [];
		var filesNeeded = [];
		var filesThatDontNeedAnythingElse = [];
		var filesThatNeedSomethingElse = {};

		var convertToSortable = function( key ){

			var item = {
				key : key,
				dependsOn : []

			};

			var files = self.assetIndex[key].fileDependencies();

			var filesFromBundles = [];

			_.each(self.assetIndex[key].bundleDependencies(), function(bundle){

				filesFromBundles = filesFromBundles.concat(self.getFilesFromBundle(bundle));

			}, this);

			item.dependsOn = _.uniq(files.concat(filesFromBundles));

			return item;

		};

		// if it's a file...
		if(this.assetIndex[key]){

			// get the file requested...
			first = key;

			// add it to 'got'
			filesGot.push(first);

			if(_.isEmpty(this.assetIndex[key].fileDependencies()) && _.isEmpty(this.assetIndex[key].bundleDependencies()) ){
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

		// pseudo code version:

		/*
			
			pre-stage:

			At this point we have a list of files. These are files we have.
			First we go through all the files we've already got and check each dependency against 
			the list of files we have. 

			This generates a list of 'files we don't have'

			the loop:

			while files we don't have > 0

				pluck item from files we don't have
				get the file
				put it in files we have

					for every filesNeeingFiles


		*/
		var blah = []

		_.each(filesGot, function(file){

			blah = blah.concat(convertToSortable(file));

		});

		//console.log(blah);

		// TODO: THe magic that makes this shit work. 

		// and we're done...
		return Assembly(filesGot);


	},


	getAssetDependencies : function( key ){

		/*
		var asset = this.assetIndex[key];

		var processed = {
			key : key,
			dependsOn : []

		};

		_.each(asset.fileDependencies(), function( file ){

			processed.dependsOn.push( file );


		});

		// so what we're doing here is checking the item for dependencies.
		// we're looking to add any files

		var files = [];

		_.each

		// are there any bundle dependencies;
		_.each(this.assetIndex[item.key].bundleDependencies, function( bundle ){



		});
*/

	},

	getFilesFromBundle : function( key ){

		var self = this;

		return (function getList(id){

			var files = self.bundleIndex[id].files.slice(0); // get the files

			_.each(self.bundleIndex[id].bundles, function(bundle){

				files = files.concat( getList( bundle ) );

			}, this);

			return files;

		}(key));

	},

	// unit testing helper..
	query : function(){

		return [this.bundleIndex, this.assetIndex];

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