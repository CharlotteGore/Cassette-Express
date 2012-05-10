	var should = require('should'),
		path = require('path');

	var norm = function(p){

		return path.normalize(p);

	}


	describe('Using the manifest module', function(){

		var Manifest = require('../lib/manifest.js');
		var assetsPath = process.env.PWD + '/test/examples';


		describe('scanning teh file system', function(){

			it('successfully generates a manifest', function(){

				var manifest = Manifest(assetsPath);

				manifest.should.have.property('createAssembly');

				var rawdata = manifest.query();

				rawdata.should.have.property(norm('/CircularFileRefs'));
				rawdata.should.have.property(norm('/NonCircularBundleRefs'));

			});

		});

		describe('Turning directory references into files', function(){

			var manifest;

			before(function(){

				manifest = Manifest(assetsPath);

			});

			it('finds all assets in folder and subfolders', function(){

				manifest.should.have.property('getFilesFromBundle');

				var assets = manifest.getFilesFromBundle(norm('/NonCircularBundleRefs'));

				assets.should.eql([norm('/NonCircularBundleRefs/A/a.js'), norm('/NonCircularBundleRefs/B/b.js'),norm('/NonCircularBundleRefs/C/c.js')]);

			});

			it('finds all assets on system if root requested', function(){

				var assets = manifest.getFilesFromBundle('');
				// yuck
				var count = 0, i;
				for(i in assets){
					count++;					
				}

				count.should.eql(22);

			});


		});

		describe('Turning requests for files/directories into a full list of files required', function(){


			var manifest;

			before(function(){

				manifest = Manifest(assetsPath);

			});

			it('can create a "bundle" of one file, no dependencies', function(){

				var bundle = manifest.buildBundle( norm('/NoDependencies/a.js') );

				bundle.should.have.length(1);

				bundle[0].key.should.eql( norm('/NoDependencies/a.js') );
				bundle[0].dependsOn.should.eql([]);
			});

			it('can create a "bundle" of three files by requesting one file, two dependencies', function(){

				var bundle = manifest.buildBundle( norm('/NonCircularFileRefs/a.js') );

				bundle.should.have.length(3);

				bundle[0].key.should.eql( norm('/NonCircularFileRefs/a.js') );
				bundle[1].key.should.eql( norm('/NonCircularFileRefs/b.js') );
				bundle[2].key.should.eql( norm('/NonCircularFileRefs/c.js') );
				//bundle[0].dependsOn.should.eql([]);
			});

			it('can create a "bundle" of three files by requesting one file, two dependencies', function(){

				var bundle = manifest.buildBundle( norm('/NonCircularFileRefs/a.js') );

				bundle.should.have.length(3);

				bundle[0].key.should.eql( norm('/NonCircularFileRefs/a.js') );
				bundle[1].key.should.eql( norm('/NonCircularFileRefs/b.js') );
				bundle[2].key.should.eql( norm('/NonCircularFileRefs/c.js') );
				//bundle[0].dependsOn.should.eql([]);
			});


			it('can build a bundle even if there are circular referencies', function(){

				var bundle = manifest.buildBundle( norm('/CircularFileRefs/a.js') );

				bundle.should.have.length(2);


				bundle[0].key.should.eql( norm('/CircularFileRefs/a.js') );
				bundle[1].key.should.eql( norm('/CircularFileRefs/b.js') );
				//bundle[0].dependsOn.should.eql([]);
			});

			it('can build a bundle from from directory, referencing two others', function(){

				var bundle = manifest.buildBundle( norm('/NonCircularBundleRefs/A') );

				bundle.should.have.length(3);


				bundle[0].key.should.eql( norm('/NonCircularBundleRefs/A/a.js') );
				bundle[1].key.should.eql( norm('/NonCircularBundleRefs/B/b.js') );
				bundle[2].key.should.eql( norm('/NonCircularBundleRefs/C/c.js') );

			});

			it('can build a bundle from from directory with circular reference to other directory', function(){

				var bundle = manifest.buildBundle( norm('/CircularBundleRefs/A') );

				bundle.should.have.length(2);


				bundle[0].key.should.eql( norm('/CircularBundleRefs/A/a.js') );
				bundle[1].key.should.eql( norm('/CircularBundleRefs/B/b.js') );


			});

			it('can build a bundle from complex pseudo-lifelike mixes of files and directory refs.', function(){

				var bundle = manifest.buildBundle( norm('/LifeLike/App/app.js') );

				bundle.should.have.length(11);


			});

		});

		describe('Turns bundles into sorted assemblies', function(){

			var manifest;

			before(function(){

				manifest = Manifest(assetsPath);

			});

			

		})


	});