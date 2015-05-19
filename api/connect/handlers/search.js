var ProxyRequest = require('./_handler');
var Formater = require('./../_formater/index').Search;
var Helpers = require('./_helpers');

var R = require('ramda');
var curry = R.curry;
var curryN = R.curryN;
var compose = R.compose;

/**
 * API 
 */

exports.query = ProxyRequest('base', function (provider, request, reply) {
	var qs = request.query;
	var q = qs.q;
	var options = qs.type;
	var networks = qs.network;

	var Connect = provider(networks);
	
	Connect.Search.query({q:q, options: options})
		//compose(responseWithSearch, applyFormater, Helpers.extract
		.then(function (data) {
			return reply({data:data});
		})
		.catch(function (err) {
			console.log(err)
		});
		//compose(response, Helpers.responseWithError)
});


/**
 * Private 
 */

var applyFormater = curry(Helpers.format)(Formater);

var responseWithSearch = compose(curry(Helpers.responseWith)('search'), curry(Helpers.fromField)('twitter'));