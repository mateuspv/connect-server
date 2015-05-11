/**
 * Twitter provider warps 'twit' with promise and provide an connect friendly API
 * @type {Function}
 */
var Twit = require('twit');
var ConnectKeys = require('../../config/keys').twitter;
var Promise = require('es6-promise').Promise;

/**
 * Twitter Request API, does not support delete method
 * @param {Object} Keys with key property
 * @param {[Object]} provider to repass request
 */
var Twitter = function (Keys, provider) {
  provider = provider || Twit;
  this._provider = new provider({
    'consumer_key': ConnectKeys.key,
    'consumer_secret': ConnectKeys.secret,
    'access_token': Keys.token,
    'access_token_secret': Keys.secret
  });
};

/**
 * request
 * @param  {String} url for request
 * @param  {String} method
 * @param  {[Object]} options
 * @return {Promise}
 */
Twitter.prototype.request = function (req) {
  var self = this;
  var url = req.url;
  var method = (req.method || 'GET').toLowerCase();
  var options = req.options || {};
  return new Promise(function(resolve, reject) {
    self._provider[method](url, options, function(err, data, response) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

module.exports = Twitter;
