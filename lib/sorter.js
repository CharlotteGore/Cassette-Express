var base = require('base-framework'),
	_ = require('underscore'),


	/*

	usage: sorter = require('./lib/sorter.js');

	sorter( CollectionToBeSorted, iterator )

	the iterator will have each item in CollectionToBeSorted passed to it.
	It must return an object containing a unique key for that item, and an array of dependencies..
	these should be the keys of other objects. 

	*/

	sorter = base.createChild().addInstanceMethods({

		sort : function( collection, iterator ){

			this.unsorted = [];
			this.result = [];
			this.dependenciesMet = [];

			var sortedCollection = [],
				node;

			// initial pass. Using the iterator, create an array of sortable objects.
			_.each(collection, function( item ){

				var node = iterator(item);

				if(!node.key && !_.isArray(node.dependsOn)){

					throw new Error('Iterator for sorter does not have key or array of dependencies');

				}else {

					node.origin = item;
					this.unsorted.push( node );

				}

			}, this);

			// do an initial search for items without dependencies.

			this.getItemsWithoutDependencies();

			while(this.dependenciesMet.length > 0){

				node = this.dependenciesMet.splice(-1)[0];
				this.result.push(node);
				
				this.removeDependencyFromItems( node.key );
				this.getItemsWithoutDependencies();

			}

			if(this.unsorted.length > 0){

				throw new Error('Cyclical dependencies. Sort failed.')


			}else{

				_.each(this.result, function( node ){

					sortedCollection.push( node.origin );

				});

				return sortedCollection;

			}

		},

		getItemsWithoutDependencies : function(){

			_.each(this.unsorted, function( item, index ){
				// if there's no dependencies left..
				if(_.isEmpty(item.dependsOn)){
					// move item into the depencies met list
					this.dependenciesMet.push( this.unsorted.splice(index, 1)[0] );
				}

			}, this);

		},

		removeDependencyFromItems : function( key ){

			_.each(this.unsorted, function( item ){

				_.each(item.dependsOn, function( dependency, index ){

					if(dependency === key){

						item.dependsOn.splice(index, 1);

					}

				}, this);


			}, this);

		},

	});

	exports = module.exports = sorter;