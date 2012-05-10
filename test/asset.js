	var should = require('should'),
		fs = require('fs'),
		Asset,
		path = require('path');

		var norm = function(p){

			return path.normalize(p);

		}


		describe('using the Asset module', function(){

			Asset = require('../lib/asset.js');

			describe('with valid path details', function(){

				var assetsPath = fs.realpathSync(process.env.PWD + '/test/examples');

				it('can create an asset', function(){

					var asset = Asset('a.js', '/NonCircularFileRefs', assetsPath);

					asset.fileDependencies().should.eql([norm('/NonCircularFileRefs/b.js')]);
					asset.bundleDependencies().should.eql([]);
					asset.should.have.property('status');			

				});

			});

		});