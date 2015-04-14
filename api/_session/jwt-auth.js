var privateKey = require('../../config/keys').token;

var validate = function (decodedToken, request, callback) {
  var token = decodedToken || {};
  var isSuccess = true;

  return callback(undefined, isSuccess, token);
};

module.exports = function (Server) {
  Server.auth.strategy('jwt', 'jwt', {
    key: privateKey,
    validateFunc: validate
  });
};
