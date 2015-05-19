var handler = require('./_handler');
var Formater = require('./../_formater/index').Search;
var Helpers = require('./_helpers');

var R = require('ramda');
var curry = R.curry;
var curryN = R.curryN;
var compose = R.compose;

/**
 * API 
 */

exports.query = handler(function (connect, request, reply) {
	var q = request.query.q;
	var Search = connect.Search;
	var response = curry(1, reply);
	
	Search.query(q)
		.then(compose(responseWithSearch, applyFormater, Helpers.extract))
		.then(response)
		.catch(compose(response, Helpers.responseWithError));
});


/**
 * Private 
 */

var applyFormater = curry(Helpers.format)(Formater);

var responseWithSearch = compose(curry(Helpers.responseWith)('search'), curry(Helpers.fromField)('twitter'));