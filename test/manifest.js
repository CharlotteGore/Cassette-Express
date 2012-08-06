	var should = require('should'),
		path = require('path');

	var norm = function(p){

		return path.normalize(p);

	}


	describe('Using the manifest module', function(){

		var Manifest = require('../lib/manifest.js');
		var assetsPath = './test/examples';
		var outputPath = '/examples';

		describe('scanning teh file system', function(){

			it('successfully generates a manifest', function(){

				var manifest = Manifest(assetsPath, outputPath);

				manifest.should.have.property('getAssembly');

				var rawdata = manifest.query();

				rawdata.should.have.property(norm('/CircularFileRefs'));
				rawdata.should.have.property(norm('/NonCircularBundleRefs'));

			});

		});

		describe('Turning directory references into files', function(){

			var manifest;

			before(function(){

				manifest = Manifest(assetsPath, outputPath);

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

				count.should.eql(23);

			});


		});

		describe('Turning requests for files/directories into a full list of files required', function(){


			var manifest;

			before(function(){

				manifest = Manifest(assetsPath, outputPath);

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

				manifest = Manifest(assetsPath, outputPath);

			});

			it('Gets an assembly from a single file', function(){
				
				var assembly = manifest.getAssembly( norm('/NoDependencies/a.js') );

				assembly.should.have.property('assets');
				assembly.should.have.property('getDebugTags');
				assembly.should.have.property('getTag');

				assembly.should.have.length(1);

				assembly.query().should.eql([norm('/NoDependencies/a.js')]);

				assembly.assets[0].data.should.eql('var a = 0;');


			});


			it('Throws an error on cyclic file dependencies', function(){
				
				(function(){

					var assembly = manifest.getAssembly( norm('/CircularFileRefs') );

				}).should.throw();


			});	

			it('Throws an error on cyclic bundle dependencies', function(){
				
				(function(){

					var assembly = manifest.getAssembly( norm('/CircularBundleRefs/A') );

				}).should.throw();


			});		

			it('Can get an assembly with file dependencies', function(){
				
				var assembly = manifest.getAssembly( norm('/NonCircularFileRefs/a.js') );

				assembly.should.have.length(3);

				assembly.query().should.eql([norm('/NonCircularFileRefs/c.js'), norm('/NonCircularFileRefs/b.js'), norm('/NonCircularFileRefs/a.js')])

			});	
			
			it('Can get an assembly with "bundle" dependencies', function(){
				
				var assembly = manifest.getAssembly( norm('/NonCircularBundleRefs/A') );

				assembly.should.have.length(3);

				assembly.query().should.eql([
						norm('/NonCircularBundleRefs/C/c.js'), 
						norm('/NonCircularBundleRefs/B/b.js'), 
						norm('/NonCircularBundleRefs/A/a.js')]);

			});	

			it('Can resolve and sort a hideously complex, mostly lifelike set of nested dependencies', function(){
				
				var assembly = manifest.getAssembly( norm('/LifeLike/App/app.js') );

				assembly.should.have.length(11);

				assembly.query().should.eql([
						norm('/LifeLike/Lib/lib.js'), 
						norm('/LifeLike/Lib/lib-plugin.js'),
						norm('/LifeLike/Lib/lib-wrapper.js'),
						norm('/LifeLike/OtherLib/1.js'),
						norm('/LifeLike/OtherLib/2.js'),
						norm('/LifeLike/AndAnotherThing/anotherthing.js'),
						norm('/LifeLike/SomeOtherThing/something.js'),
						norm('/LifeLike/OtherLib/3.js'),
						norm('/LifeLike/App/app-namespace.js'),
						norm('/LifeLike/App/Features/feature.js'), 
						norm('/LifeLike/App/app.js')]);

			});	

		});


	});