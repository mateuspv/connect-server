var Promise = require('es6-promise').Promise;

var ProxyRequest = require('./_handler');
var Formater = require('./../_formater/index').Post;
var Helpers = require('./_helpers');

var R = require('ramda');
var curry = R.curry;
var curryN = R.curryN;

/**
 * API 
 */
exports.Facebook = {};
exports.Twitter = {};

exports.all = ProxyRequest(function (connect, request, reply) {
  var Posts = connect.Post.all();

  Posts
    .then(extract)
    .then(formatPostsAll)
    .then(Helpers.concat)
    .then(responseWithPosts)
    .then(curryN(1, reply));
});

exports.like = ProxyRequest('base', function (provider, request, reply) {
	var post = request.payload.post;
	var networkName = post.network;
	var postId = request.params.id;
	var isLiked = !post.user_likes;
	var Network = provider([networkName]);
	
	if(change === 'favorited') {
		Network.Post.like({id: postId, isLiked: isLiked})
			.then(function (result) {
				if(isSuccessLikeAction(result, networkName)) {
					reply.statusCode = 200;
					post.id = postId;
					return post;
				}
				return reply({});
			})
			.then(responseWithPost)
			.then(curryN(1, reply))
			.catch(function (err) {
				reply.statusCode = 500;
				reply({err: err})
			})
	}
	else if(change === 'retweeted') {
		Twitter.Post.retweet({id: postId})
			.then(function() {
				reply.statusCode = 200;
				post.id = postId;
				reply(post);
			})
	}
});

exports.create = ProxyRequest('base', function (provider, request, reply) {
	var post = request.payload.post;
	var networkName = post.network;
	var Network = new provider([networkName]);
	var message = post.message;

	Network.Post.create({message: message})
		.then(Formater.create[networkName])
		.then(function (response) {
			post.id = response.id;
			post.created_at = Date.now();

			reply({
				post: post,
			})
		})
		.catch(function (err) {
			console.log(err);
			reply({err: err})
		})
});

exports.Facebook.like = ProxyRequest('base', function (provider, request, reply) {
	var post = request.payload.postFacebook;
	var postId = request.params.id;
	var isLiked = !post.like;
	var Facebook = provider(['facebook']);

	Facebook.Post.like({id: postId, isLiked: isLiked})
		.then(function (result) {
			if(isSuccessLikeAction(result, 'facebook')) {
				reply.statusCode = 200;
				post.id = postId;
				return post;
			}
			return reply({err: 'facebook internal error'});
		})
		.then(curry(responseWith)('post_facebook'))
		.then(curryN(1, reply))
		.catch(function (err) {
			reply.statusCode = 500;
			reply({err: err})
		})
});

exports.Twitter.retweetORStar = ProxyRequest('base', function (provider, request, reply) {
	var post = request.payload.postTwitter;
	var postId = request.params.id;
	var change = post.changes;
	var isFavorited = !post.favorited;
	var Twitter = provider(['twitter']);
	var response = '';

	if(change === 'favorited') {
		response = Twitter.Post.like({id: postId, isLiked: isFavorited})
	}
	else if(change === 'retweeted') {
		response = Twitter.Post.retweet({id: postId});

	}
	else {
		response = Promise.resolve(post);
	}

	response.then(function() {
		post.id = postId;
		reply(post);		
	})
});

/**
 * Private 
 */

var responseWithPosts = curry(Helpers.responseWith)('posts');

var applyFormater = curry(Helpers.format)(Formater);

var responseWith = function(field, data) {
	var response = {};
	response[field] = data;
	return response;
}

var responseWithPost = function (post) {
	return {posts: post};
};

var isSuccessLikeAction = function (data, networkName) {
	var success = false;
	if(networkName === 'facebook') {
		var isSuccess = data[0].success;
		return (isSuccess && isSuccess === true) || false;
	}
	if(networkName === 'twitter') {
		return data.errors || true;
	}
	return success;
};


var extract = function (data) {
	var facebook = data[0];
	var twitter = data[1];
	return {facebook: facebook, twitter: twitter};
};

var formatPostsAll = function (data) {
	var facebookFeed = Formater.facebook(data.facebook.feed.data);
	var facebookHome = Formater.facebook(data.facebook.home.data);
	var twitter = Formater.twitter(data.twitter);
	var facebook = [].concat(facebookHome, facebookFeed);
	return {facebook: facebook, twitter: twitter};
};
