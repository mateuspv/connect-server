var isAuthFacebook = require('./../../api/auth/helpers/is-auth').facebook;

module.exports = function (status) {
  return isAuthFacebook(status);
};
