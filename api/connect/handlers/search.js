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
		.then(function (data) {
			var result = { search: {id: 1} };
			var facebook = '';
			var twitter = '';

			if(searchIncludesNetwork(networks, 'twitter') && searchIncludesNetwork(networks, 'facebook')) {
				facebook = data[1];
				twitter = data[0];
			}
			else if(searchIncludesNetwork(networks, 'twitter')) {
				twitter = data[0];
			}
			else {
				facebook = data[0]
			}

			if(searchIncludesNetwork(networks, 'twitter')) {
				console.log(data, twitter)
				var userTwitter = Formater.twitter.profile(twitter.profiles);
				result.search.user_twitter = userTwitter.map(curry(mapField)('id_str'));
				result.user_twitter = userTwitter;
			}

			if(searchIncludesNetwork(networks, 'facebook')) {
				var userFacebook = Formater.facebook.profile(facebook.profiles);
				result.search.user_facebook = userFacebook.map(curry(mapField)('id'));
				result.user_facebook = userFacebook;
			}
			reply(result);
		})
		.catch(function (err) {
			console.log(err)
			reply({err: err, search: []});
		});
});


/**
 * Private 
 */

//var applyFormater = curry(Helpers.format)(Formater);

var responseWithSearch = compose(curry(Helpers.responseWith)('search'), curry(Helpers.fromField)('twitter'));

var mapField = function (field, data) {
	return data[field];
};

var formateResource = function (resource, network, data) {
	return Formater[network][resource](data);
};

var formatSearchPost = curry(formateResource)('post');
var formatSearchProfile = curry(formateResource)('profile');

var searchIncludesNetwork = function (networks, networkName) {
	return networks.indexOf(networkName) > -1;
};

var handleTwitter = function (twitter) {
	var twitterR1 = twitter[0];
	var twitterR2 = twitter[1];
	var twitterUser = twitter[2];

	var R1 = [];
	var R2 = [];
	var R3 = [];

	if(twitterR1) {
		R1 = formatSearchPost('twitter', twitterR1['statuses']);
	}

	if(twitterR2) {
		R2 = Array.isArray(twitterR2) ? formatSearchProfile('twitter', twitterR2) : formatSearchPost('twitter', twitterR2['statuses']);
	}

	if(twitterUser) {
		R3 = Formater.twitter.profile(twitterUser);
	}

	return [].concat(R1, R2, R3);
}