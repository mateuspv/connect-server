var JWT = require('jsonwebtoken');
var KEY = require('./../../../config/keys').token;
var Promise = require('es6-promise').Promise;

exports.generate = function (object) {
  return JWT.sign(object, KEY);
};

exports.verify = function(token) {
  return new Promise(function (resolve, reject) {
      JWT.verify(token, KEY, function (err, object) {
        return err ? reject(err) : resolve(object);
      });
  });
};
