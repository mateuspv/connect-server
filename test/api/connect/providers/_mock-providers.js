var Promise = require('es6-promise').Promise;

var create = function (options) {
  return new Promise(function (resolve) {
    resolve(options);
  });
};

var Facebook = function () {
};

Facebook.prototype = {
  Like: {
    create: create
  }
};

var Twitter = function () {
};

Twitter.prototype = {
  Like: {
    create: create
  }
};

exports.facebook = Facebook;
exports.twitter = Twitter;
