var base = require('base-framework'),
	_ = require('underscore'),
	parser = require('./referenceParser.js')(),
	fs = require('fs');

var assetsPath;

var Asset = base.createChild().addInstanceMethods({

	init : function(name, path, assets){

		this.name = path + '/' + name;

		this.path = path + '/';

		assetsPath = assets;

		this.status = {}; 

		this.dependencies = {
			files : [],
			bundles : []
		};

		this.hasChanged();
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

			dependency = fs.realpathSync(assetsPath + this.path + ref).replace(assetsPath, '');

			if(/\.js$/.test(dependency)){

				this.addFileDependency( dependency );

			} else {

				this.addBundleDependency( dependency );

			}

		}, this);

		return this;

	},

	hasChanged : function(){

		var status = fs.statSync(assetsPath + this.name);

		if(_.isEqual(status, this.status)){

			return false;

		}else{

			this.status = status;
			return true;

		}

	},

	getData : function( callback ){

		this.data = fs.readFileSync(assetsPath + this.name, 'utf8', callback);

	}

});

exports = module.exports = Asset;