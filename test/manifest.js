	var should = require('should');


	describe('Using the manifest module', function(){

		var Manifest = require('../lib/manifest.js');

		describe('with valid path details', function(){

			var assetsPath = process.env.PWD + '/test/examples';

			it('successfully generates a manifest', function(){

				var manifest = Manifest(assetsPath);

				manifest.should.have.property('createAssembly');

				var rawdata = manifest.query();

				rawdata.should.have.property('');
				rawdata.should.have.property('/CircularFileRefs');
				rawdata.should.have.property('/NonCircularBundleRefs');

			});

			it('successfully gets all assets in a specified folder', function(){

				var manifest = Manifest(assetsPath);

				manifest.should.have.property('getFilesFromBundle');

				var assets = manifest.getFilesFromBundle('/NonCircularBundleRefs');

				assets.should.have.property('/NonCircularBundleRefs/A/a.js');
				assets.should.have.property('/NonCircularBundleRefs/B/b.js');
				assets.should.have.property('/NonCircularBundleRefs/C/c.js');


			});

			it('successfully gets all assets if root requested', function(){

				var manifest = Manifest(assetsPath);

				var assets = manifest.getFilesFromBundle('')
				// yuck
				var count = 0, i;
				for(i in assets){
					count++;					
				}

				count.should.eql(11);

			});

			it('can return an assembly of one file, no dependencies', function(){

				var manifest = Manifest(assetsPath);

				var assembly = manifest.createAssembly('/NoDependencies/a.js');

				assembly.should.have.property('getDebugTags');
				assembly.should.have.property('getTag');
				assembly.should.have.length(1);

			});


		});


	})