var handler = require('./_handler');
var Formater = require('./../_formater/index').Post;

exports.all = handler(function (connect, request, reply) {
  var Posts = connect.Post.all();

  Posts.then(function(allPosts) {
    var facebook = Formater.facebook(allPosts[0].data);
    var twitter = Formater.twitter(allPosts[1]);
    var all = [].concat(facebook, twitter);

    reply({posts: all });
  });
});

exports.create = handler('base', function (provider, request, reply) {
  var Facebook = provider(['facebook', 'twitter']);

  Facebook.Post.create({
    message: 'test'
  });

  reply(Facebook);
});