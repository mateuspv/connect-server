json.set('name', user.name);
json.set('tweets', user.statuses_count);
json.set('following', user.friends_count);
json.set('follower', user.followers_count);
json.set('profile_image', user.profile_image_url_https);
json.set('description', user.description);
json.set('profile_banner_url', user.profile_banner_url);

