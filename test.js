var FB = require('./connect/providers/facebook');
var token="CAAKC8G2aZCt0BAO48K29p1pcNZCE8UvjKEAdCZAZCnUZACp91gZBWFuZB64e9oxujmkINzVGUuPLJwGYKFpKfTo9lcpWiFC4WUk7Wk4NFc9a9Nes6ZCwKVUgxh6SaCGPpk4kIzRNoB3ONz4uFUUfMW8Rc4lkMTU4k379Hca9TZCNn4BwXWpicrus3MRUBZCOz1MPVXZAvmPLmZBiA9le9r6FrObW";
var Facebok = new FB({token: token});

Facebok.request({url: '/me/feed'})
	.then(function (data) {
		console.log(data);
	})
	.catch(function (err) {
		console.log('error', err);
	})

//user_posts,publish_actions