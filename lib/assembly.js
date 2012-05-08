var base = require('base-framework'),
	_ = require('underscore');


var Assembly = base.createChild().addInstanceMethods({

	init : function( asset, manifest ){

		this.name = asset;
		this.manifest = manifest;

		this.reassemble();

	},

	reassemble : function(){

		var filesWeHave = this.manifest.getAsset(this.name);
		var filesRequiringFilesWeDontHave = [];

		_.each(filesWeHave, function(file){

			_.each(file.fileDependencies, function(){
				
				
			})

		});

	},


});



/*

	F = files we have.
	L = list of files for which we don't have the files it depends on

	foreach file f in F
		foreach dependency d in f
			if d not in F 
				push f into L			

	while(L is non empty){
	
	


	}

	get(a.js)

		-> put a in F
		-> populateL. a depends on b and c. We don't have b or c in F so a goes in L
		-> while(L not empty)
			-> for each n in L
				for each dependency d in n
					add d to L


*/