var ProxyRequest = require('./_handler');
var Formater = require('./../_formater/index');

var R = require('ramda');
var curry = R.curry;
var compose = R.compose;
var curryN = R.curryN;
var map = R.map;
var forEachIndexed = R.forEachIndexed;


exports.all = ProxyRequest('base', function (provider, request, reply) {
	var Twitter = provider(['twitter']);
	Twitter.Hashtag.all()
		.then(hashtagsResponse)
		.then(curryN(1, reply));
});

var extractTrends = function(response) {
	return response[0][0].trends;
};

var addID = forEachIndexed(function (object, index) {
	return object.id = index;
});

var responseWithHashtag = function(data) {
	return {hashtag: data};
};

var hashtagsResponse = compose(
	responseWithHashtag,
	addID,
	map(Formater.Hashtag.apply),
	extractTrends
);