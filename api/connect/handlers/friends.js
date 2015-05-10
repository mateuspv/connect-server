var handler = require('./_handler');
var Formater = require('./../_formater/index').Friends;
var Helpers = require('./_helpers');

var R = require('ramda');
var curry = R.curry;
var curryN = R.curryN;

/**
 * API 
 */

exports.all = handler(function (connect, request, reply) {
	var Friends = connect.Friends;
	var result = Friends.all();

	result
		.then(Helpers.extract)
		.then(applyFormater)
		.then(Helpers.concat)
		.then(responseWithFriends)
		.then(curryN(1, reply));
});

/**
 * Privte
 */

var applyFormater = curry(Helpers.format)(Formater);

var responseWithFriends = curry(Helpers.responseWith)('friends');