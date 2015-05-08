var handler = require('./_handler');
var Formater = require('./../_formater/index');
var Promise = require('es6-promise').Promise;

exports.get = handler('base', function (provider, request, reply) {
	var id = request.query.id;
	var networkName = request.query.network;
	var res = {};
	
	var Network = provider([networkName]);

	function takeId(element) {
		return element.id;
	}

	function pickFormater (type) {
		return Formater[type][networkName];
	}

	Network.Profile.get(id)
		.then(function (perfil) {
			var profile = perfil[0];
			var posts = (profile.posts || {}).data || [];
			var profileAfterFormated = pickFormater('Profile')(profile);

			profileAfterFormated.posts = posts.map(takeId);
			res.profiles = [profileAfterFormated];

			return posts;
		})
		.then(function (posts) {
			var postFormater = Formater.Post[networkName];
			res.posts = postFormater(posts);
		})
		.then(function (profile, posts) {
			return reply(res);
		})
		.catch(function (err) {
			console.log(err)
			reply({ err: err, profiles: []})
		});
});
