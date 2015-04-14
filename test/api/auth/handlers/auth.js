var assert = require('chai').assert;
var Server = require('./../../../../index');

suite('api/auth/status', function () {
  var URL;
  var URL_WITH_TOKEN_FB;
  var URL_WITH_TOKEN_TW;
  var URL_WITH_BOTH_TOKENS;
  var URL_WITH_INCORRECT_TOKEN;
  this.timeout(500);

  setup(function () {
    var TOKEN_FACEBOOK = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmYWNlYm9vayI6eyJ0b2tlbiI6ImEifSwiaWF0IjoxNDI3MDk1NTc3fQ.AmzcqAOJ4ASIql0vfcfYY-hFZ52YS42YKpE1NmasExU';
    var TOKEN_TW = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0d2l0dGVyIjp7InRva2VuIjoieiIsInNlY3JldCI6InoifSwiaWF0IjoxNDI3MDk5NDU1fQ.1zGRGUt39CqRgREqaUzAfYzBYlJgjxOOcM3Z3VQ-Jf0';
    URL = '/api/auth/status';
    URL_WITH_FB_TOKEN = '/api/auth/status?token=' + TOKEN_FACEBOOK;
    URL_WITH_TOKEN_TW = '/api/auth/status?token=' + TOKEN_TW;
    URL_WITH_BOTH_TOKENS = '/api/auth/status?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmYWNlYm9vayI6eyJ0b2tlbiI6IngifSwidHdpdHRlciI6eyJ0b2tlbiI6IngiLCJzZWNyZXQiOiJ6In0sImlhdCI6MTQyNzA5OTc5NH0.CZP8vJM_U0zxBSuBfnMe6lSerPcRXwmHgZsa_s319fg';
    URL_WITH_INCORRECT_TOKEN = '/api/auth/status?token=eyJ0eXAiOiJK';
  });

  teardown(function (done) {
    Server.stop(undefined, done);
  })

  test('with no token', function (done) {
    Server.inject(URL, function(result) {
      var res = JSON.parse(result.result);
      assert.equal(false, res.isAuthFacebook);
      assert.equal(false, res.isAuthTwitter);
      assert.notOk(res.token);
      done();
    });
  });

  test('with incorrect token', function (done) {
    Server.inject(URL_WITH_INCORRECT_TOKEN, function(result) {
      var res = JSON.parse(result.result);
      assert.equal(false, res.isAuthFacebook);
      assert.equal(false, res.isAuthTwitter);
      assert.notOk(res.token);
      done();
    });
  });

  test('with facebook token', function (done) {
    Server.inject(URL_WITH_FB_TOKEN, function(result) {
      var res = JSON.parse(result.result);
      assert.equal(true, res.isAuthFacebook, 'should have facebook auth');
      assert.equal(false, res.isAuthTwitter);
      assert.ok(res.token);
      done();
    });
  });

  test('with twitter token', function (done) {
    Server.inject(URL_WITH_TOKEN_TW, function(result) {
      var res = JSON.parse(result.result);
      assert.equal(false, res.isAuthFacebook);
      assert.equal(true, res.isAuthTwitter, 'should have twitter auth');
      assert.ok(res.token);
      done();
    });
  });

  test('with facebook & twitter token', function (done) {
    Server.inject(URL_WITH_BOTH_TOKENS, function(result) {
      var res = JSON.parse(result.result);
      assert.equal(true, res.isAuthFacebook, 'should have facebook auth');
      assert.equal(true, res.isAuthTwitter, 'should have twitter auth');
      assert.ok(res.token);
      done();
    });
  });
});
