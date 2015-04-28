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
			return Twitter.request({url: 'users/show', options: {'user_id': id}});
  		}
  	}
};
