var Promise = require('es6-promise').Promise;

module.exports = {
  Post: {
    all: function (Facebook, fields) {
      var options = {fields: ['id', 'full_picture', 'from', 'message', 'link', 'picture', 'description', 'created_time']};
      return Facebook.request({ url: 'me/home', options: options});
    },
    create: function(Facebook, options) {
      return Facebook.request({ url: 'me/feed', method: 'POST', options: options});
    },
    like: function (Facebook, options) {
      var method = options.isLiked ? 'DELETE' : 'POST';
      var url = options.id + '/likes';
      return Facebook.request({ url: url, method: method});
    }
  },
  Search: {
  	query: function (Facebook, options) {
  		return new Promise(function(resolve) {
  			resolve({});
  		});
  	}
  },
  Profile: {
    get: function (Facebook, id) {
      var fields = ['id', 'name', 'about', 'bio', 'cover', 'posts{id,full_picture,from,message,link,picture,description,created_time}'];
      var options = { fields: fields };
      return Facebook.request({url: id, options: options});
    }
  },
  Friends: {
    all: function (Facebook) {
      var options = {limit: 100};
      return Facebook.request({url: 'me/friends', options: options});
    }
  }
}
