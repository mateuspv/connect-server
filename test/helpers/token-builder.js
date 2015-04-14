var assert = require('chai').assert;
var TokenBuilder = require('../../helpers/token-builder');

suite('token-builder', function () {
  var subject;
  var OBJECT;

  setup(function () {
    subject = undefined;
    OBJECT = {hello: 'world'};
  });

  test('#generate', function () {
    subject = TokenBuilder.generate(OBJECT);
    assert.isString(subject, 'token in string format');
  });

  suite('#verify', function () {
    var token;

    setup(function() {
      token = TokenBuilder.generate(OBJECT);
      subject = TokenBuilder.verify(token);
    });

    test('#verify returns promise', function () {
      assert.isFunction(subject.then, 'ducktype promise');
      assert.isFunction(subject.catch, 'ducktype promise');
    });

    test('#verify success', function (done) {
      subject.then(function (token) {
        assert.isObject(token, 'token object');
        assert.deepEqual(token, OBJECT);
        done();
      });
    });

    test('#verify invalid token', function (done) {
      var subject = TokenBuilder.verify('abz');
      subject
        .catch(function(err) {
          assert.ok(err, 'expected error');
          done();
        });
    });
  });
});
