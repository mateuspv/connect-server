var ConnectBase = require('./../../../connect/index');

module.exports = function (type, cb) {

  return function (request, reply) {

    return request.session.get()
      .then(function (keys) {
          if (typeof type === 'function') {
            return type(new ConnectBase(['facebook', 'twitter'], keys), request, reply);
          }

          if (type === 'base') {
            return cb(beforeGetNetworks(keys), request, reply);
          }
      });
  }
}

var beforeGetNetworks = function (keys) {
  return function (networks) {
    return new ConnectBase(networks, keys);
  }
};
