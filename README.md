#Cassette Express

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
  ...
  app.use('view options', {
    assets : cassette.middleware()
  });

  // in layout.jade
  != assets.useAsset('/mycode')
  
  // which would output a load of script tags which includes everything in /mycode and anything
  // they depend on, and everything they depend on and so on...

Unlike Cassette MVC, there's no requirement to explicitly reference bundles in advance. Any javascript asset or directory in assetsPath can be referenced or requested.

Sadly after a promising spike I'm now rewriting it in a slightly more sane way with more test coverage. At the moment there's a big chunk missing so it doesnt work but hopefully won't be too long now. 