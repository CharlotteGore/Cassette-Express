	var should = require('should');

	var sorter = require('../lib/sorter.js');

	var nonCyclic = {
		'a' : {
			name : 'a',
			dependencies : ['b', 'c', 'd']

		},
		'b' : {
			name : 'b',	
			dependencies : ['c', 'd']	
		},
		'c' : {
			name : 'c',
			dependencies : ['d']			
		},
		'd' : {
			name : 'd',
			dependencies : []			
		}

	};

	var cyclic = {
		'a' : {
			name : 'a',
			dependencies : ['b', 'c', 'd']

		},
		'b' : {
			name : 'b',	
			dependencies : ['c', 'd']
		},
		'c' : {
			name : 'c',
			dependencies : ['d']			
		},
		'd' : {
			name : 'd',
			dependencies : ['a']			
		}

	};

	describe('the sorting algorithm', function(){

		describe('using an object collection', function(){

			it('can resolve dependencies', function(){

				var sorted = sorter().sort(nonCyclic, function( item ){
					return {
						key : item.name,
						dependsOn : item.dependencies.slice(0)				
					};

				});

				sorted.should.have.length(4);
				sorted[0].should.equal(nonCyclic['d']);
				sorted[1].should.equal(nonCyclic['c']);
				sorted[2].should.equal(nonCyclic['b']);
				sorted[3].should.equal(nonCyclic['a']);

			});


		})

	})