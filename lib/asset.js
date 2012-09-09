var base = require('base-framework'),
	path = require('path'),
	_ = require('underscore'),
	parser = require('./referenceParser.js')(),
	fs = require('fs');

var assetsPath;
var nodeModulesPath;

var Asset = base.createChild().addInstanceMethods({

	init : function(name, lpath, assets, stat, nodeModules){

		this.name = path.normalize(lpath + '/' + name);
		this.webName = lpath.replace('\\', '/') + '/' + name;
		this.path = path.normalize(lpath + '/');

		assetsPath = assets;

		nodeModulesPath = nodeModules;

		this.dependencies = {
			files : [],
			bundles : [] 
		};

		if(stat && stat.mtime){
			this.status = stat.mtime.getTime();
		}else{
			this.status = 0;			
		}
		this.getData();
		this.parseReferences();

		return this;

	},

	addFileDependency : function( dependency ){

		this.dependencies.files.push( dependency );

		return this;

	},

	addBundleDependency : function( dependency ){

		this.dependencies.bundles.push( dependency );

		return this;

	},

	fileDependencies : function(){

		return this.dependencies.files.slice(0);

	},

	bundleDependencies : function(){

		return this.dependencies.bundles.slice(0);

	},

	parseReferences : function(){

		var refs = parser.getReferences(this.data),
			dependency;

		_.each(refs, function( ref ){

			if( (/^\/node_modules/).test( ref ) ){

				if( /cassette\-express/.test( this.path ) ){

					return;

				} else {

					dependency = path.normalize(   path.relative( assetsPath, nodeModulesPath + ref.replace('/node_modules', '') ));
					
				}

			} else {

				dependency = path.normalize( this.path + ref );

			}



			if(/\.js$/.test(dependency)){

				this.addFileDependency( dependency );

			} else {

				this.addBundleDependency( dependency );

			}

		}, this);

		return this;

	},

	hasChanged : function(){

		var status;

		try{

			status = fs.statSync(assetsPath + this.name);

		}catch(e){

			return true;

		}

		if(_.isEqual(status.mtime.getTime(), this.status)){

			return false;

		}else{

			this.status = status.mtime.getTime();

			return true;

		}

	},

	getData : function( callback ){

		this.data = fs.readFileSync(assetsPath + this.name, 'utf8', callback);

	}

});

exports = module.exports = Asset;