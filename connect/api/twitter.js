var Promise = require('es6-promise').Promise;

module.exports = {
	Post: {
		all: function (Twitter, options) {
			return Twitter.request({url: 'statuses/home_timeline'});
		},
		create: function (Twitter, options) {
			return Twitter.request({url: 'statuses/update', method: 'POST', options: {status: options.message}})
		},
		like: function (Twitter, options) {
			var urlPartial = !options.isLiked ? 'create' : 'destroy';
			var url = '/favorites/' + urlPartial;
			var options = {id: options.id};
			return Twitter.request({url: url, method: 'POST', options: options});
		},
		create: function (Twitter, options) {
			var opts = {status: options.message};
			return Twitter.request({ url: "statuses/update", method: 'POST', options: opts});
		}
	},
	User: {
		current: function (Twitter, options) {
			return Twitter.request({url: 'account/verify_credentials'});
		}
	},
	Search: {
		query: function (Twitter, options) {
			var query = {q: options};
			return Twitter.request({url: 'search/tweets', options: query});
		}
  	},
  	Profile: {
  		get: function (Twitter, id) {
  			var options = {'user_id': id};
  			var Profile = Twitter.request({url: 'users/show', options: options});
  			var Posts =  Twitter.request({url: 'statuses/user_timeline', options: options});
  			return Promise.all([Profile, Posts])
  				.then(function (data) {
  					data[0].posts = {}
  					data[0].posts.data = data[1];
  					return data[0];
  				})
  		}
  	},
  	Friends: {
  		all: function (Twitter) {
  			var limitFriendsQuery = function (ids) {
				return ids.slice(0, 100);
			}

  			return Twitter.request({url: 'friends/ids'})
	  			.then(function (friends) {
					return limitFriendsQuery(friends.ids);
				})
				.then(function (ids) {
					var options = {user_id: ids};
					return Twitter.request({url: 'friendships/lookup', options: options});
				});
  		}
  	}
};
