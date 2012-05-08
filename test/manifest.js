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

			it('can return an assembly of one file, no dependencies', function(){

				var manifest = Manifest(assetsPath);

				var assembly = manifest.createAssembly('/NoDependencies/a.js');

				assembly.should.have.property('getDebugTags');
				assembly.should.have.property('getTag');
				assembly.assets.should.have.length(1);

			});

			it('can return an assembly of one file, no dependencies', function(){

				var manifest = Mansifest(assetsPath);

				var assembly = manifest.createAssembly('/NoDependencies/a.js');

				assembly.should.have.property('getDebugTags');
				assembly.should.have.property('getTag');
				assembly.assets.should.have.length(1);

			});

		});


	})