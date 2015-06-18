
/**
 * REFATORAR
 */


var Promise = require('es6-promise').Promise;
var Networks = require('./providers/index');
var API = require('./api/index');

var NetworkBuilder = function (networksNames, Keys, providers, api) {
  var providers = providers || Networks;
  var api = api || API;
  var networksNames = Array.isArray(networksNames) ? networksNames : [networksNames];
  var it = callAll(networksNames, providers, api, Keys);

  // remove it.
  return {
    Post: {
      all: it('Post', 'all'),
      like: it('Post', 'like'),
      create: it('Post', 'create'),
      retweet: it('Post', 'retweet'),
    },
    Like: {
      create: it('Like', 'create')
    },
    User: {
      current: it('User', 'current')
    },
    Search: {
      query: it('Search', 'query')
    },
    Profile: {
      get: it('Profile', 'get')
    },
    Friends: {
      all: it('Friends', 'all')
    },
    Group: {
      all: it('Group', 'all'),
      find: it('Group', 'find'),
    },
    Hashtag: {
      all: it('Hashtag', 'all')
    }
  };
};

var methods = function (networks, keys, providers, apis, resource, method, opts) {
  return networks.map(function (network) {
    var key = keys[network];
    var provider = new providers[network](key);
    var api = apis[network];
    var action = api[resource][method];
    return action(provider, opts);
  });
}

var callAll = function (networks, providers, apis, keys) {
  return function (resource, method) {
      return function (opts) {
        var allCalls = methods(networks, keys, providers, apis, resource, method, opts);
        return Promise.all(allCalls);
    };
  };
};

module.exports = NetworkBuilder;
