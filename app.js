var fs = require('fs'),
	base = require('base-framework'),
	_ = require('underscore'),
	gatherer = require('gatherer');

var assetsPath = process.env.PWD + '/public/javascripts/';

var filesIndex = {};
var bundles = {};

var traverseBundle = function(bundle, currentPath){

	var files = fs.readdirSync(assetsPath + currentPath);

	_.each(files, function(file){

		var currentFile = assetsPath + currentPath + '/' + file,
		stat = fs.statSync(currentFile),
		src = '',
		lines = [],
		fails = 0,
		index = 0,
		matches = false,
		dependency;

		if(stat.isFile()){

			if(/\.js$/.test(file)){

				var asset = {
					src : fs.readFileSync(currentFile, 'utf8'),
					dependencies : {
						bundles : [],
						files : []
					},
					stat : stat,
					name : file,
					path : currentPath + '/'

				}

				lines = asset.src.split(/\n/g)

				asset.src = '';

				// we allow a couple of failures before giving up...
				while(fails < 2){

					matches = lines[index].match(/([\s]+|)\/\/\/([\s]+|)<reference path="([\.\/a-zA-Z0-9_\-]+)" \/>([\s]+|)/);

					if(matches){

						// we convert relative paths or bundle paths to a real paths
						dependency = fs.realpathSync(assetsPath + asset.path + matches[3]).replace(assetsPath, '');

						if(/\.js$/.test(dependency)){

							asset.dependencies.files.push( dependency );

						}else{

							asset.dependencies.bundles.push( dependency );

						}

					}else{

						fails++;

					}

					index++;

				}

				filesIndex[asset.path + asset.name] = asset;

				bundle.files.push( filesIndex[asset.path + asset.name] );

			}


		}else if(stat.isDirectory()){

			traverseBundle(bundle, currentPath + '/' + file);

		}

	})

	return;

};

var processBundle = function(bundleName){

	var required = {
		files : {},
		bundles : {},
		assembly : []		
	};

	var bundle = bundles[bundleName];

	var noFileDependencies = [];

	var followDependencies = function(asset){
		// bundles
		_.each(asset.dependencies.bundles, function(depBundle, index){

			if(bundles[depBundle]){
			
				required.bundles[depBundle] = bundles[depBundle]; // not yet satisfied

			}else{

				throw(bundleName + ' depends on ' + depBundle + ' which doesnt exist');

			}

		});

		_.each(asset.dependencies.files, function(file, index){

			required.files[file] = filesIndex[file]; 

			followDependencies(filesIndex[file]);

		});		

	};

	_.each(bundle.files, function(asset){
		required.files[asset.path + asset.name] = asset;
		followDependencies(asset);


	});

	bundles[bundleName].files = required.files;
	bundles[bundleName].bundles = required.bundles;
	bundles[bundleName].processed = true;


	return;

};


var cassette = base.createChild().addInstanceMethods({

	setAssetsPath : function( path ){

		// an absolute path for 
		assetsPath = path;

		return this;

	},

	createBundle : function( path ){

		/* lib/sds/ */
		var bundleName = path;

		bundles[bundleName] = {
			files : []		
		};

		traverseBundle(bundles[bundleName], path);

		return this;

	},

	createBundlePerSubDirectory : function( path ){

		var listing = fs.readdirSync(assetsPath + path),
			self = this;

		_.each(listing, function(item){

			var stat = fs.statSync(assetsPath + path + "/" + item);

			if(stat.isDirectory()){

				self.createBundle(path + "/" + item);

			}

		});

		return this;

	},

	getBundles : function(){

		return bundles;

	},

	getFilesIndex : function(){

		return filesIndex;

	},

	getBundle : function(bundleName, callback){

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

					asset.dependencies.files[index] = filesIndex[file];

				})

			});

		};

		if(bundles[bundleName]){

			if(!bundles[bundleName].assembly){

				getExternalBundles(bundleName);
				collapseTheBundles();
				bundles[bundleName].assembly = sortBundle( unsorted );
			}

			callback({assemble : bundles[bundleName].assembly, duration: (new Date()).getTime() - time});

		
		}else{

			throw('no such bundle');

		}	

	}

});

var sortBundle = function( data ){

	var noDependencies = [], assembly =[], unsorted = [], n;

	// convert to an array...
	_.each(data, function( asset ){

		unsorted.push( asset );

	});

	var findAssetsWithoutDependencies = function(){

		//noDependencies = [];

		_.each(unsorted, function(asset, index){

			if(_.isEmpty(asset.dependencies.files)){

				noDependencies.push(asset);
				unsorted.splice(index, 1);

			}

		});

	};

	findAssetsWithoutDependencies();
	
	while(noDependencies.length > 0){

		n = noDependencies.splice(noDependencies.length -1, 1)[0];

		assembly.push(n);

		_.each(unsorted, function(asset, i){

			_.each(asset.dependencies.files, function(file, index){
				
				//console.log(file);

				if( (n.path + n.name) === (file.path + file.name) ){
					asset.dependencies.files.splice(index, 1);

					if(asset.dependencies.files.length < 2){

					}
				}

			});

		})

		findAssetsWithoutDependencies();
		//console.log('nodep length '  + noDependencies.length);



	}

	if(unsorted.length > 0){

		throw('unable to resolve dependencies!');

	}else{

		return assembly;

	}

}


exports = module.exports = cassette;

/*





then... inside Jade..

var bundles = require('cassette-express');

bundles
	.setAssetsPath( process.env.PWD + '/scripts') // by default it's the express /public/javascripts
	.createBundle('lib/sds') // sucks in everything, including subfolders
	.createBundlePerSubDirectory('lib/nice') // turns the sub directorys into bundles..
		-> is shortcut for 
		.createBundle('nice/nice/nice')
		.createBundle('nice/nice/ui')
		.createBundle('nice/nice/app')

add.set('view options', {
	
	bundles : bundles.middleware('debug')

})

OR

add.set('view options', {
	
	bundles : bundles.middleware('production')

})

then, inside the template...

!= bundles.useBundle('lib/sds')

.. which will output

<scripts type='text/javascript' src='one for every source file, in order'></scripts>


horribly this means converting

../lib/nice/ui 

to 

~/lib/nice/ui

or ../../sds.js

assetsPath + 'sds/Features/ToolDrawers/Tools'

*/