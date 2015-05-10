var ProxyRequest = require('./_handler');
var Formater = require('./../_formater/index');
var Helpers = require('./_helpers');

var R = require('ramda');
var curry = R.curry;
var map = R.map;
var compose = R.compose;

/**
 * API 
 */

exports.get = ProxyRequest('base', function (provider, request, reply) {
	var id = request.query.id;
	var networkName = request.query.network;

	var Network = provider([networkName]);	
	var response = {};
	
	var getPostsFromProfile = compose(
		curry(applyFormaterFor)(networkName, 'Post'),
		unzipPostsFromProfile,
		unzipProfile
	);

	var getProfile = compose(
		curry(applyFormaterFor)(networkName, 'Profile'),
		unzipProfile
	);

	Network.Profile.get(id)
		.then(function (profile) {
			response.profiles = [getProfile(profile)];
			return profile;
		})
		.then(function (profile) {
			response.posts = getPostsFromProfile(profile);
			response.profiles[0].posts = map(extractId, profile);
			reply(response);
		})
		.catch(function (err) {
			reply({err: err, posts: [], profiles: []})
		});
});

/**
 * Private 
 */

var unzipProfile = function (profile) {
	return profile[0];
};

var unzipPostsFromProfile = function (profile) {
	return (profile.posts || {}).data || [];
};

var extractId = function (element) {
	return element.id;
};

var applyFormaterFor = function(networkName, type, data) {
	return Formater[type][networkName](data);
};