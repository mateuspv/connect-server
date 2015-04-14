var assert = require('chai').assert;
var isAuth = require('./../../../../api/auth/helpers/is-auth');

suite('helper: is-auth', function () {
  var subject;

  setup(function () {
    subject = undefined;
  });

  suite('#facebook', function () {
    test('authenticated', function () {
      subject = isAuth.facebook({facebook: {token: 'token'}});
      assert.equal(subject, true);
    });

    test('no authenticated - no facebook field', function () {
      subject = isAuth.facebook();
      assert.equal(subject, false);
    });
  });

  suite('#twitter', function () {
    test('authenticated', function () {
      subject = isAuth.twitter({twitter: {token: 'token', secret: 'secret'}});
      assert.equal(subject, true);
    });

    test('no authenticated - no params', function () {
      subject = isAuth.twitter();
      assert.equal(subject, false);
    });

    test('no authenticated - only token', function () {
      subject = isAuth.twitter({twitter: {token: 'token'}});
      assert.equal(subject, false);
    });

    test('no authenticated - only secret', function () {
      subject = isAuth.twitter({twitter: {secret: 'secret'}});
      assert.equal(subject, false);
    });
  });
});
