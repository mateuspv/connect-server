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
    image: post.picture || '',
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


Profile.facebook = function (profile) {
    var hasCoverEmblemed = (profile.cover || {}).source || '';
    return {
        id: profile.id,
        name: profile.name,
        description: profile.description || '',
        user_image: 'http://graph.facebook.com/' + profile.id + '/picture',
        link: 'http://facebook.com/' + profile.id,
        profile_banner_url: hasCoverEmblemed,
        network: 'facebook'
    };
};

Profile.twitter = function (profile) {  
    return {
        id: profile.id_str,
        link: 'https://twitter.com/' + profile.screen_name,
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