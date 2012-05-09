#Cassette Express

Status: 9th/5/2012 Still a little way away from being a working piece of software :(

In the process of porting a portion of Andrew Davey's [Cassette]https://github.com/andrewdavey/cassette to Node.js. This repo is basically the work in progress. 

I've been using the c# .net version of Cassette on my current contract to help me manage my client side javascript assets. It means you can break up your javascript into smaller, more manageable files, specify their dependencies in comments and then have Cassette generate the necessary script tags. 

Crucially, in production mode, it bundles all these individual javascript files, along with all their dependencies, into a single minified download. 

This project is to get a similar experience when using Express on Node. 

The target implementation:

	// in app.js
	var cassette = require('cassette-express')({
		assetsPath : process.env.PWD + '/public/javascripts',
		outputPath : '/javascripts'
	});

	app.set('view options', {
		assets : cassette.middleware()
	});

	// in layout.jade
	!= assets.useAsset('mycode.js')

	// which, in debug, would output a script tag for mycode.js, and one for every file it depends on, and one for every file
	// they depend on and so on, all sorted properly and in the correct order. 
	// in production, it would turn all these individual scripts into a single uglified, heavily cached, download. 

Unlike Cassette MVC, there's no requirement to explicitly reference bundles in advance. Any javascript asset or directory in assetsPath can be referenced or requested.

Sadly after a promising spike I'm now rewriting it in a slightly more sane way with more test coverage. At the moment there's a big chunk missing so it doesnt work but hopefully won't be too long now. 

Done: Sorting. Parsing references. Scanning the filesystem to build a manifest. 
To Do: turn a request for an asset into a canonical list of required files ready for sorting, 'production' mode (assemble into single file, uglify, caching), monitoring file system for changes.