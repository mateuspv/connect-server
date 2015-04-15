var Keys = require('./keys');

module.exports = function (Server) {
  Server.auth.strategy('facebook', 'bell', {
    provider: 'facebook',
    password: 'cookie_encryption_password',
    clientId: Keys.facebook.key,
    clientSecret: Keys.facebook.secret,
    isSecure: false
  });

  Server.auth.strategy('twitter', 'bell', {
    provider: 'twitter',
    password: 'cookie_encryption_password',
    clientId: Keys.twitter.key,
    clientSecret: Keys.twitter.secret,
    isSecure: false
  });
};