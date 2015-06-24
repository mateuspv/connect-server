var Promise = require('es6-promise').Promise;
var EMPTY_RESPONSE = {data: []};

var alwaysResolveOr = function(promsise, orData) {
  return new Promise(function(resolve) {
    promsise.then(function(data) {
      resolve(data)
    })
    .catch(function() {
      resolve({data: []})
    });
  });
};

module.exports = {
  Post: {
    all: function (Facebook, fields) {
      var options = {fields: ['id', 'full_picture', 'from', 'message', 'link', 'picture', 'description', 'created_time']};
      var homeNews = Facebook.request({ url: 'me/home', options: options});
      var feed = Facebook.request({ url: 'me/feed', options: options});
      var home = alwaysResolveOr(homeNews, EMPTY_RESPONSE);
      return Promise.all(feed, home])
        .then(function (data) {
          return {feed: data[0] || [], home: data[1] || []};
        })
    },
    like: function (Facebook, options) {
      var method = options.isLiked ? 'DELETE' : 'POST';
      var url = options.id + '/likes';
      return Facebook.request({ url: url, method: method});
    },
    create: function (Facebook, options) {
      return Facebook.request({url: 'me/feed', method: 'POST', options: options});
    },
    retweet: function(Facebook, options) {},
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
  },
  Group: {
    find: function(Facebook, id) {
      var options = {fields: ['id', 'icon', 'cover', 'name', 'description', 'feed.limit(15)', 'members.limit(50){cover,first_name,id}']};
      return Facebook.request({url: String(id), options: options});
    },
    all: function(Facebook) {
      var options = {fields: ['id', 'cover', 'name', 'icon', 'description']};
      var promise = Facebook.request({url: '/me/groups', options:options});
      return alwaysResolveOr(promise, EMPTY_RESPONSE)
    }
  }
}
