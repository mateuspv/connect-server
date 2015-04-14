var assert = require('assert');
var tokenUrlBuilder = require('../../helpers/token-url-builder');

suite('#token-url-builder', function () {
  var URL;
  var subject;

  setup(function () {
    subject = undefined;
    URL = 'www.google.com';
  });

  test('URL without token/secret', function () {
    subject = tokenUrlBuilder({url: URL});
    assert.equal(subject, 'www.google.com', 'should return the original url');
  });

  test('URL with token', function () {
    subject = tokenUrlBuilder({url: URL, token: 'abc'});
    assert.equal(subject, 'www.google.com?token=abc', 'should return url with token on query string');
  });

  test('URL with secret token', function () {
    subject = tokenUrlBuilder({url: URL, secret: 'abc'});
    assert.equal(subject, 'www.google.com?secret=abc', 'should return url with secret token on query string');
  });

  test('URL with token and secret', function () {
    subject = tokenUrlBuilder({url: URL, token: 'abc', secret: 'dfg'});
    assert.equal(subject, 'www.google.com?token=abc&secret=dfg', 'should return url with token/secret token on query string');
  });
});
