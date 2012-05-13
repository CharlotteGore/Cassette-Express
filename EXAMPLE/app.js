
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

  // require cassette...
  , cassette = require('cassette-express')(); // we added an entry to package.json here..

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  // make the cassette middleware available inside templates..
  app.set('view options', {bundles : cassette.middleware()})


  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
