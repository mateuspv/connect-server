var handler = require('./_handler');
var Formater = require('./../_formater/index').Search;

exports.query = handler(function (connect, request, reply) {
	var q = request.query.q;
	var search = connect.Search.query(q);
	
	search
		.then(function (result) {
			var facebook = result[0];
			var twitter = Formater.twitter(result[1]);
			reply({search: twitter});
		});
});