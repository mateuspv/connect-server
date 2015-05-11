var ProxyRequest = require('./_handler');
var Formater = require('./../_formater/index').Post;
var Helpers = require('./_helpers');

var R = require('ramda');
var curry = R.curry;
var curryN = R.curryN;

/**
 * API 
 */

exports.all = ProxyRequest(function (connect, request, reply) {
  var Posts = connect.Post.all();

  Posts
    .then(Helpers.extract)
    .then(applyFormater)
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

	Network.Post.like({id: postId, isLiked: isLiked})
		.then(function (result) {
			if(isSuccessLikeAction(result)) {
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
});

exports.create = function (request, reply) {
}

/**
 * Private 
 */

var responseWithPosts = curry(Helpers.responseWith)('posts');

var applyFormater = curry(Helpers.format)(Formater);

var responseWithPost = function (post) {
	return {posts: post};
};

var isSuccessLikeAction = function (data) {
	var success = data[0].success
	return (success && success === true) || false;
}
