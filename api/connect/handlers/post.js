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

/**
 * Private 
 */

var responseWithPosts = curry(Helpers.responseWith)('posts');

var applyFormater = curry(Helpers.format)(Formater);

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
}
