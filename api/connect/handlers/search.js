var handler = require('./_handler');
var Formater = require('./../_formater/index').Search;
var Helpers = require('./_helpers');

var R = require('ramda');
var curry = R.curry;
var curryN = R.curryN;


/**
 * API 
 */

exports.query = handler(function (connect, request, reply) {
	var q = request.query.q;
	var Search = connect.Search.query(q);
	
	Search
	    .then(Helpers.extract)
    	.then(applyFormater)
		.then(function (result) {
			return {search: result.twitter};
		})
		.then(curry(1, reply));
});


/**
 * Private 
 */

var applyFormater = curry(Helpers.format)(Formater);