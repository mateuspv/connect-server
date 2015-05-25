var ProxyRequest = require('./_handler');
var Formater = require('./../_formater/index');
var Helpers = require('./_helpers');

var R = require('ramda');
var curry = R.curry;
var curryN = R.curryN;
var compose = R.compose;

exports.find = ProxyRequest('base', function (provider, request, reply) {
	var id = request.params.id;
	var Facebook = provider(['facebook']);
	Facebook.Group.find(id)
		.then(function(res) {
			var data = res[0];
			var group = Formater.Group.facebook(data);
			var posts = extractPosts(data.feed.data);
			var members = data.members.data.map(Formater.Group.member);
			var allUsers = [];
			group.posts = posts.map(Formater.mapId);

			group.members = members.map(Formater.mapId);
			allUsers = allUsers.concat(members);

			reply({
				group_facebook:group,
				post_facebook: posts,
				user_facebook: allUsers
			})
		})
		.catch(function(e) {
			console.log(e)
			reply({e:e})
		})
});

var extractPosts = function(posts) {
	return posts.map(function(post) {
		return {
			id: post.id,
			message: post.message,
		}
	})
}