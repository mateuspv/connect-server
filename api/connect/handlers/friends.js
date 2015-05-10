var handler = require('./_handler');
var Formater = require('./../_formater/index').Friends;
var Promise = require('es6-promise').Promise;

var extract = function (friends) {
	return {facebook: friends[0].data, twitter: friends[1]};
};

var format = function (friends) {
	var facebook = Formater.facebook(friends.facebook);
	var twitter = Formater.twitter(friends.twitter);
	return {facebook: facebook, twitter: twitter};
}

var concat = function (friends) {
	var result = [];
	return result.concat(friends.facebook, friends.twitter);
}

var response = function (reply) {
	return function (friends) {
		return reply({friends: friends})
	}
}

exports.all = handler(function (connect, request, reply) {
  var Friends = connect.Friends;

	Friends.all()
		.then(extract)
		.then(format)
		.then(concat)
		.then(response(reply));
});
