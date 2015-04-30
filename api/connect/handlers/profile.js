var handler = require('./_handler');
var Formater = require('./../_formater/index').Profile;

exports.get = handler('base', function (provider, request, reply) {
	var id = request.query.id;
	var networkName = request.query.network;
	
	var Network = provider([networkName]);
	console.log(id)
	Network.Profile.get(id)
		.then(function (profile) {
			var user = profile[0];
			var resFormat = Formater[networkName](user);
			var res = [resFormat];
			reply({ profiles: res });
		})
		.catch(function (err) {
			console.log(err)
			reply({ err: err, profiles: []})
		});
});
