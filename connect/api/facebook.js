var Promise = require('es6-promise').Promise;

module.exports = {
  Post: {
    all: function (Facebook, fields) {
      var options = {fields: ['id', 'full_picture', 'from', 'message', 'link', 'picture', 'description', 'created_time']};
      return Facebook.request({ url: 'me/home', options: options});
    },
    create: function(Facebook, options) {
      return Facebook.request({ url: 'me/feed', method: 'POST', options: options});
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
      var fields = ['id', 'name', 'about', 'bio', 'cover', 'posts{full_picture}'];
      var options = { fields: fields };
      var User = Facebook.request({url: id, options: options});
      return User;
    }
  },
  Friends: {
    all: function (Facebook) {
      var options = {limit: 100};
      return Facebook.request({url: 'me/friends', options: options});
    }
  }
}
