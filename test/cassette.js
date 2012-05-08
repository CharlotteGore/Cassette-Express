	var should = require('should'),
		cassette = require('../lib/cassette.js')


	describe('Using cassette to manage javascript assets',function(){

		describe('when given a path to javascript files', function(){

			it('creates an instance with ', function(){

				var assets = cassette({ assetsPath : process.env.PWD + '/test/examples' });

				assets.should.have.property('middleware');
				assets.middleware().should.have.property('useAsset');
				//bundles.getBundles().should.have.property('NonCircularFileRefs');

			});

		});

	});

