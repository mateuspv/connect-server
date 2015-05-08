var Promise = require('es6-promise').Promise;

module.exports = {
	Post: {
		all: function (Twitter, options) {
			return Twitter.request({url: 'statuses/home_timeline'});
		},
		create: function (Twitter, options) {
			return Twitter.request({url: 'statuses/update', method: 'POST', options: {status: options.message}})
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
  			var Profile = Twitter.request({url: 'users/show', options: {'user_id': id}});
  			var Posts =  Twitter.request({url: 'statuses/user_timeline', options: {'user_id': id}});
  			return Promise.all([Profile, Posts])
  				.then(function (data) {
  					data[0].posts = {}
  					data[0].posts.data = data[1];
  					return data[0];
  				})
  		}
  	}
};
