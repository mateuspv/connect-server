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
				facebook = data[0];
				twitter = data[1];
			}
			else if(searchIncludesNetwork(networks, 'twitter')) {
				twitter = data[0];
			}
			else {
				facebook = data[0];
			}

			if(searchIncludesNetwork(networks, 'twitter')) {
				var userTwitter = Formater.twitter.profile(twitter.profiles);
				result.search.user_twitter = userTwitter.map(mapId);
				result.user_twitter = userTwitter;
				
				// all posts
				var allUsersFromPosts = allUsersFromTweets(twitter.tweets);
				var allUserPosts = Formater.twitter.post(twitter.tweets);
				result.user_twitter = result.user_twitter.concat(allUsersFromPosts);
				result.post_twitter = allUserPosts
				result.search.post_twitter = allUserPosts.map(mapId);
			}

			if(searchIncludesNetwork(networks, 'facebook')) {
				var userFacebook = Formater.facebook.profile(facebook.profiles || []);
				result.search.user_facebook = userFacebook.map(mapId);
				result.user_facebook = userFacebook;

				var pagesFacebook = Formater.facebook.page(facebook.page || []);
				result.search.page_facebook = pagesFacebook.map(mapId);
				result.page_facebook = pagesFacebook;

				var groupsFacebook = Formater.facebook.group(facebook.group || []);
				result.search.group_facebook = groupsFacebook.map(mapId);
				result.group_facebook = groupsFacebook;
				
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

var allUsersFromTweets = function (tweets) {
	var allUsers = tweets.map(function (tweet) {
		return tweet.user
	})
	return Formater.twitter.profile(allUsers);
}

var mapId = function (data) {
	return data.id;
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