var isAuthTwitter = require('./../../api/auth/helpers/is-auth').twitter;

module.exports = function (status) {
  return isAuthTwitter(status);
};
