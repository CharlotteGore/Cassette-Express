var base = require('base-framework'),
	_ = require('underscore'),
	fs = require('fs'),
	path = require('path'),
	UglifyJS = require('uglify-js'),
	crypto = require('crypto');


var Assembly = base.createChild().addInstanceMethods({

	init : function( assets, config ){

		this.assets = assets;
		this.outputPath = config.outputPath || "/javascripts/";
		this.assetsPath = config.assetsPath || "./public/javascripts"
		this.buildPath = config.buildPath || "/cassette";

		this.length = 0;
		this.merged = '';
		this.debugTags = '';

		_.each(this.assets, function(asset){

			this.length++;
			this.merged += '\n' + asset.data;

			var src = path.normalize(this.outputPath + '/' + asset.name);

			if( /node_modules/.test(src) ){

				var md5sum = crypto.createHash('md5');
				md5sum.update(asset.data);

				var hash = md5sum.digest('hex');

				fs.writeFileSync(this.assetsPath + this.buildPath + '/' + hash + ".js", asset.data);

				src = path.normalize(this.outputPath + this.buildPath + '/' + hash + ".js");

			}

			this.debugTags += "<script type='text/javascript' src='" + src + "'></script>"

		}, this);

		return this;

	},

	getDebugTags : function( outputPath ){

		return this.debugTags;

	},

	getTag : function( outputPath ){

		if(!this.minifiedFile){

			try{

				fs.statSync( path.normalize( this.assetsPath + this.buildPath ) );

			}catch(e){

				fs.mkdirSync( path.normalize( this.assetsPath + this.buildPath ) );

			}	

			var merged = '// Created with Cassette-Express on ' + (new Date()).toDateString() + '\n\n';
			merged = merged + this.merged;

			var md5sum = crypto.createHash('md5');
			md5sum.update(merged);

			var hash = md5sum.digest('hex');	

			this.minifiedFile = this.outputPath + this.buildPath + '/' + hash + '.min.js';

			try {
                var minified = UglifyJS.minify(merged, {fromString: true});

				fs.writeFileSync(this.assetsPath + this.buildPath + '/' + hash + '.min.js', minified.code);
				
			}catch(e){
                
                console.log("FAILED!!!! ", e);
				fs.writeFileSync(this.assetsPath + this.buildPath + '/' + hash + '.min.js', merged);

			}




		}

		return "<script type='text/javascript' src='" + this.minifiedFile + "'></script>";

	},

	query : function(){

		var list = [];

		_.each(this.assets, function(asset){

			list.push(asset.name);

		});

		return list;

	}



});


exports = module.exports = Assembly;
