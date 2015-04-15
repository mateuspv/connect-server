json.set('name', user.name);
json.set('tweets', user.statuses_count);
json.set('following', user.friends_count);
json.set('follower', user.followers_count);
json.set('profile_image', user.profile_image_url_https);