var Promise = require('es6-promise').Promise;

module.exports = {
  Post: {
    all: function (Facebook, fields) {
      var options = {fields: ['id', 'full_picture', 'from', 'message', 'link', 'picture', 'description', 'created_time']};
      var home = Facebook.request({ url: 'me/feed', options: options});
      return home;
    },
    like: function (Facebook, options) {
      var method = options.isLiked ? 'DELETE' : 'POST';
      var url = options.id + '/likes';
      return Facebook.request({ url: url, method: method});
    },
    create: function (Facebook, options) {
      return Facebook.request({url: 'me/feed', method: 'POST', options: options});
    }
  },
  Search: {
  	query: function (Facebook, options) {
      var result = [[], [], []];
      var type = options.options;
      var q = options.q;

      if(type.indexOf('facebookUser') > -1) {
        result[0] = Facebook.request({url: '/search', options: {q: q, type:'user', limit: 100, fields: ['cover','name','link','gender']}});
      }

      if(type.indexOf('page') > -1) {
        result[1] = Facebook.request({url: '/search', options: {q: q, type:'page', limit: 100, fields: ['cover','name','about','id','link']}});
      }

      if(type.indexOf('group') > -1) {
        result[2] = Facebook.request({url: '/search', options: {q: q, type:'group', limit: 100, fields: ['cover','name', 'id','icon', 'description']}});
      }

      return Promise.all(result)
        .then(function (response) {
          return {
            profiles: response[0] ? response[0].data : [],
            page: response[1] ? (response[1].data || []) : [],
            group: response[2] ? (response[2].data || []) : []
          }
        })
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
