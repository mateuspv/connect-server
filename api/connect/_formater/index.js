/**
 * Collector pick corrects fields for each network
 * @param  {String} network name
 * @return {Object} correct object
 */

var mock = require('./twitter-post-all.json');

/**
 * map(fn (list))
 */
function map(fn) {
  return function(list) {
    return list.map(fn);
  }
}

var Post = exports.Post = {};

Post.facebook = map(function(post) {
  return {
    id: post.id,
    user_image: 'http://graph.facebook.com/' + post.id + '/picture',
    network: 'facebook',
    video: post.source || '',
    image: post.image || '',
    created_at: post.created_time,
    from: post.from.name || '',
    from_id: post.from.id || '',
    message: post.message || '',
    shares_count: post.shares_count || '',
    user_shares: post.user_shares || false,
    likes_count: post.likes_count || '',
    user_likes: post.user_likes || false,
  }
});

Post.twitter = map(function(post) {
  return {
    id: post.id,
    user_image: post.user.profile_image_url,
    network: 'twitter',
    video: post.source || '',
    image: post.image || '',
    created_at: post.created_at,
    from: post.user.name || '',
    from_id: post.user.id_str || '',
    message: post.text || '',
    shares_count: post.retweet_count || '',
    user_shares: post.user_shares || false,
    likes_count: post.favorite_count || '',
    user_likes: post.user_likes || false,
  }
});
