var Promise = require('es6-promise').Promise;

module.exports = {
  Post: {
    all: function (Facebook, options) {
      return Facebook.request({ url: 'me/home' });
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
      var fields = ['id', 'name', 'description', 'about', 'bio', 'posts', 'cover'];
      var options = { fields: fields };
      var User = Facebook.request({url: id, options: options});
      return User;
    }
  }
}
