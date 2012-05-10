var base = require('base-framework'),
	path = require('path'),
	fs = require('fs'),
	_ = require('underscore'),
	
	Asset = require('./asset.js'),
	Assembly = require('./assembly.js'),
	sorter = require('./sorter.js')
	Manifest;

// var m = require('./lib/manifest.js')(process.env.PWD + '/test/examples');
// m.createAssembly('/NonCircularFileRefs/a.js')

// Here is the Bundle object.
var Manifest = base.createChild().addInstanceMethods({

	init : function( assetsPath ){

		this.assetsPath = path.normalize(assetsPath);

		this.bundleIndex = {};
		this.assetIndex = {};

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

	convertToSortable : function( key ){

		var item = {
			key : key,
			dependsOn : []

		};

		var single = this.assetIndex[key].fileDependencies();

		var filesFromBundles = [];

		_.each(this.assetIndex[key].bundleDependencies(), function(bundle){

			filesFromBundles = filesFromBundles.concat(this.getFilesFromBundle(bundle));

		}, this);

		item.dependsOn = _.uniq(single.concat(filesFromBundles));

		return item;

	},

	createAssembly : function( key ){

		if(key){

			key = path.normalize(key);

		}

		var self = this; // keep a reference to this

		var single;
		var initialFiles = [];

		// an object to quickly check if we have a file.
		var lookup = {};

		// if it's a file...
		if(this.assetIndex[key]){

			// get the file requested...
			single = key;

			// add it to 'got'
			initialFiles.push(single);
			lookup[key] = this.assetIndex[single];

			if(_.isEmpty(this.assetIndex[key].fileDependencies()) && _.isEmpty(this.assetIndex[key].bundleDependencies()) ){
				// early exit: Assembly is a single file without dependences. We're done!
				return Assembly(this.assetIndex[key]);

			}
		// else if it's a directory we know about..
		}else if(this.bundleIndex[key]){

			// get all the files from the directory requested (and the sub directories)
			initialFiles = this.getFilesFromBundle(key);

			_.each(initialFiles, function( file ){

				lookup[file] = this.assetIndex[file];

			}, this);

		// or we throw up.
		}else{

			throw new Error('No such asset: No files or directories found matching ' + key);

		}

		var filesThatNeedFiles = [];
		var finalList = [];

		console.log(initialFiles);

		// process 1: converting a collection of file keys to sortable objects (with keys an dependencies)
		_.each(initialFiles, function(file){

			filesThatNeedFiles = filesThatNeedFiles.concat(this.convertToSortable(file));

		}, this);

		// process 2 : find which items actually do need files...
		while(filesThatNeedFiles.length > 0){

			// pluck one from the filesThatNeedFiles
			var testItem = filesThatNeedFiles.splice(-1)[0];

			_.each(testItem.dependsOn, function( dependency, index){

				//console.log('dependency: ' + dependency)

				if(!lookup[dependency]){

					// add the file to filesThatNeedFiles...
					if(this.assetIndex[dependency]){

						filesThatNeedFiles.push( this.convertToSortable(dependency) )

					}else if(this.bundleIndex[dependency]){

						console.log('why does this never ever fire??');

					}

				}
			}, this);

			finalList.push(testItem);

		}

		//return finalList;

		//return Assembly(filesGot);


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