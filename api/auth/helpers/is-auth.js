var statusify = function (status, field, cb) {
  return (status && status[field]) ? cb(status[field]) : false;
};

/**
 * twitter checks if twitter keys exist in a status
 * @param  {Status} status
 * @return {Boolean}
 */
var twitter = function (status) {
  return statusify(status, 'twitter', function (status) {
    return status.token && status.secret ? true : false;
  });
};

/**
 * isAuthFacebook checks if facebook key exist in a status
 * @param  {Status} status
 * @return {Boolean}
 */
var facebook = function (status) {
  return statusify(status, 'facebook', function (status) {
    return status.token ? true : false;
  });
};

var isAuth = function (session) {
	return facebook(session) && twitter(session);
}

isAuth.facebook = facebook;
isAuth.twitter = twitter
module.exports = isAuth;