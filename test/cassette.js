	var should = require('should'),
		cassette = require('../lib/cassette.js')


	describe('Using cassette to manage javascript assets',function(){

		describe('when creating bundles', function(){

			it('can create a manifest', function(){

				var bundles = cassette({ assetsPath : process.env.PWD + '/test/examples' });

				bundles.should.have.property('manifest');
				var manifest = bundles.manifest.query()

				manifest.should.have.property('');
				manifest.should.have.property('/CircularFileRefs');
				manifest.should.have.property('/NonCircularBundleRefs');			
				//bundles.getBundles().should.have.property('NonCircularFileRefs');

			});

		});

	});

