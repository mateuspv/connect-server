/**
 * Collector pick corrects fields for each network
 * @param  {String} network name
 * @return {Object} correct object
 */

var mock = require('./twitter-post-all.json');


function map(fn) {
  return function(list) {
    return list.map(fn);
  }
}

var Post = exports.Post = {};

Post.facebook = map(function(post) {
  return {
    id: post.id,
    user_image: 'http://graph.facebook.com/' + post.from.id + '/picture',
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

var Search = exports.Search = {};

Search.twitter = function (posts) {
    return Post.twitter(posts['statuses']);
}

var Profile = exports.Profile = {};

{
  "id": "534393527", 
  "first_name": "Paulo", 
  "gender": "male", 
  "last_name": "Ragonha", 
  "link": "http://www.facebook.com/534393527", 
  "locale": "en_US", 
  "name": "Paulo Ragonha", 
  "updated_time": "2014-04-12T23:16:52+0000"
}

Profile.facebook = function (profile) {  
    return {
        id: profile.id,
        name: profile.name,
        user_image: 'http://graph.facebook.com/' + profile.id + '/picture',,
        network: 'facebook'
    };
};

Profile.twitter = function (profile) {  
    return {
        id: profile.id_str
        name: profile.name,
        user_image: profile.profile_image_url_https,
        description: profile.description,
        posts_total: profile.statuses_count,
        followers_count: profile.followers_count,
        friends_count: profile.friends_count,
        profile_banner_url: profile.profile_banner_url,
        profile_color: profile.profile_background_color,
        network: 'twitter'
    };
};