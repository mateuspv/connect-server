var handler = require('./_handler');
var Formater = require('./../_formater/index').Post;
var Helpers = require('./_helpers');
var R = require('ramda');
var curry = R.curry;
var curryN = R.curryN;

/**
 * API 
 */

exports.all = handler(function (connect, request, reply) {
  var Posts = connect.Post.all();

  Posts
    .then(Helpers.extract)
    .then(applyFormater)
    .then(Helpers.concat)
    .then(responseWithPosts)
    .then(curryN(1, reply));
});


exports.create = function (request, reply) {
}

/**
 * Private 
 */

var responseWithPosts = curryN(1, Helpers.responseWith)('posts');

var applyFormater = curry(Helpers.format)(Formater);
