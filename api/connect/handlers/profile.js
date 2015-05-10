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
		curry(appyFormaterFor)(networkName, 'Posts'),
		unzipPostsFromProfile,
		unzipProfile
	);

	var getProfile = compose(
		curry(applyFormaterFor)(networkName, 'Profile'),
		unzipProfile
	);

	Network.Profile.get(id)
		.then(function (profile) {
			response.profile = getProfile(profile);
			return profile;
		})
		.then(function (profile) {
			response.posts = getPostsFromProfile(profile);
			response.profile.posts = map(extractId, profile);
			reply(response);
		})
		.catch(function (err) {
			reply({err: err})
		});
});

/**
 * Private 
 */

var unzipProfile = function (profile) {
	return profile[0];
};

var unzipPostsFromProfile = function (profile) {
	var posts = profile.posts || {};
	return posts.data || [];
};

var extractId = function (element) {
	return element.id;
};

var appyFormaterFor = function(networkName, type, data) {
	return Formater.Post[networkName](posts);
};