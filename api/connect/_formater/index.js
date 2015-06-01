/**
 * Collector pick corrects fields for each network
 * @param  {String} network name
 * @return {Object} correct object
 */

var map = function (fn) {
  return function(list) {
    return list.map(fn);
  }
};

var helpers = {};
helpers.facebook = {};

helpers.facebook.profileImage = function (id) {
    return 'http://graph.facebook.com/' + id + '/picture';
}

helpers.facebook.profileLink = function (id) {
    return 'http://facebook.com/' + id;
}

exports.mapId = function(collection) {
    return collection.id
}


var facebook = exports.facebook = {};

facebook.post = function(post) {
   return {
        id: post.id,
        link: helpers.facebook.profileLink(post.id),
        story: post.story,
        picture: post.picture,
        description: post.picture,
        external_link: post.link,
        owner: post.from.id,
        type: post.type,
        created_time: post.created_time,
        message: post.message,
        like: false,
   }
};

facebook.post.profile = function(post) {
    var response = {};
    if(post.from.cover) {
        response.cover = post.from.cover;
    }
    return {
        id: post.from.id,
        name: post.from.name,
        image: helpers.facebook.profileImage(post.from.id),
        link: helpers.facebook.profileLink(post.from.id),
    }
}


var Post = exports.Post = {};


Post.facebook = map(function(post) {
  var trySeparateIdFromResource = post.id.split('_');
  var resourceId = trySeparateIdFromResource[1] ? trySeparateIdFromResource[1] : post.id;

  return {
    id: post.id,
    user_image: 'http://graph.facebook.com/' + post.from.id + '/picture',
    network: 'facebook',
    video: post.source || '',
    image: post.full_picture || post.picture || '',
    created_at: post.created_time,
    from: post.from.name || '',
    from_id: post.from.id || '',
    message: post.message || '',
    shares_count: post.shares_count || '',
    user_shares: post.user_shares || false,
    likes_count: post.likes_count || '',
    user_likes: post.user_likes || false,
    link: 'https://www.facebook.com/' + resourceId,
  }
});

Post.twitter = map(function(post) {
  return {
    id: post.id_str,
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
    link: 'https://twitter.com/' + post.user.screen_name + '/status/' + post.id_str,
  }
});

Post.create = {};
Post.create.facebook = function(post) {
    return {id: post[0].id};
};

Post.create.twitter = function (post) {
    return {id: post[0].id_str};
}

var Search = exports.Search = { twitter: {}, facebook: {} };

Search.twitter.post = Post.twitter;

Search.twitter.profile = map(function (user) {
    return {
        id: user.id_str,
        name: user.name,
        screenname: user.screen_name,
        image: user.profile_image_url,
        bio: user.description || '',
        link: 'https://twitter.com/' + user.screen_name,
        cover: user.profile_image_url_https,
    }
});

Search.twitter.post = map(function (post) {
    var result = {
        id: post.id_str,
        user: post.user.id_str,
        message: post.text,
        favorited: post.favorited,
        retweeted: post.retweeted,
        favorite_count: post.favorite_count,
        retweet_count: post.retweet_count,
        created_at: post.created_at,
        link: 'https://twitter.com/' + post.user.screen_name + '/status/' + post.id_str,
    };
    if(post.retweeted_status) {
        result.retweet = post.retweeted_status.id_str
    }
    return result;
});

Search.facebook.profile = map(function (user) {
   return {
    id: user.id,
    name: user.name || '',
    image: 'http://graph.facebook.com/' + user.id + '/picture',
    cover: user.cover ? user.cover.source : '',
    link: user.link,
  }
});

Search.facebook.page = map(function (page) {
   return {
    id: page.id,
    description: page.description || '',
    name: page.name || '',
    image: 'http://graph.facebook.com/' + page.id + '/picture',
    cover: page.cover ? page.cover.source : '',
    link: page.link,
  }
});

Search.facebook.group = map(function (group) {
   return {
    id: group.id,
    description: group.description || '',
    name: group.name || '',
    icon: group.icon,
    cover: group.cover ? group.cover.source : '',
    link: 'https://www.facebook.com/' + group.id,
  }
});


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
        profile_banner_url: profile.profile_banner_url  + '/1500x500',
        profile_color: profile.profile_background_color,
        network: 'twitter'
    };
};

var Friends = exports.Friends = {};

Friends.twitter = map(function (friend) {
    return {
        id: friend.id_str,
        name: friend.name,
        user_image: 'https://twitter.com/' + friend.screen_name + '/profile_image',
        link: 'https://twitter.com/' + friend.screen_name,
        network: 'twitter'
    }
});

Friends.facebook = map(function (friend) {
    return {
        id: friend.id,
        name: friend.name,
        user_image: helpers.facebook.profileImage(friend.id),
        link: helpers.facebook.profileLink(friend.id),
        network: 'facebook'
    }
});

var Group = exports.Group = {};
Group.facebook = function(group) {
    return {
        id: group.id,
        link: helpers.facebook.profileLink(group.id),
        cover: group.cover.source,
        icon: group.icon,
        name: group.name,
        description: group.description,
        posts: [],
        members: [],
    }
}

Group.member = function(member) {
    var result = {
        id: member.id,
        name: member.first_name,
        image: helpers.facebook.profileImage(member.id),
        link: helpers.facebook.profileLink(member.id),
    };
    if(member.cover) {
        result.cover = member.cover.source;
    }
    return result;
}

var Hashtag = exports.Hashtag = {};

Hashtag.apply = function(hashtag) {
    return {
        hashtag: hashtag.name
    };
}