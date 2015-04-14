var assert = require('chai').assert;
var SessionBase = require('./../../../../api/_session/helpers/session');

suite('Session', function () {
  var Session;
  var TOKEN_FB_AND_TW;
  var DECRYPTED_OBJECT;

  setup(function() {
    // { facebook: { token: 'x' }, twitter: { token: 'x', secret: 'z' }
    TOKEN_FB_AND_TW = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmYWNlYm9vayI6eyJ0b2tlbiI6IngifSwidHdpdHRlciI6eyJ0b2tlbiI6IngiLCJzZWNyZXQiOiJ6In0sImlhdCI6MTQyNzA5OTc5NH0.CZP8vJM_U0zxBSuBfnMe6lSerPcRXwmHgZsa_s319fg';
    DECRYPTED_OBJECT = {facebook: { token: 'x' }, twitter: { token: 'x', secret: 'z' }, iat: 1427099794};
    Session = new SessionBase(TOKEN_FB_AND_TW);
  });

  test('#get #set return a promise', function () {
    var getPromise = Session.get();
    var setPromise = Session.set('a', 5);

    assert.isDefined(getPromise.then);
    assert.isDefined(getPromise.catch);

    assert.isDefined(setPromise.then);
    assert.isDefined(setPromise.catch);
  });

  test('Session with wrong token', function (done) {
    var Session = new SessionBase('a');
    var Promise = Session.get();

    Promise.then(function (value) {
      assert.deepEqual(value, {}, 'wrong session return in a empty object');
      done();
    });
  });

  suite('#get', function () {
    test('with `key` return single value', function (done) {
      Session
        .get('facebook')
        .then(function(value) {
          assert.deepEqual(value, {token: 'x'}, 'Should have same object');
          done();
        });
    });

    test('with no key returns all session object', function (done) {
      Session
        .get()
        .then(function (value) {
          assert.deepEqual(value, DECRYPTED_OBJECT);
          done();
        });
    });
  });

  test('#set', function (done) {
    Session
      .set('test', 123);

    Session
      .get('test')
      .then(function (value) {
        assert.equal(value, 123, 'get should return the value');
      });

    Session.get()
      .then(function (session) {
        assert.propertyVal(session, 'test', 123, 'should have property with value setted');
        done();
      });
  });

  suite('#build', function () {
    test('with same token', function (done) {
      Session.build()
        .then(function(token) {
          assert.strictEqual(token, TOKEN_FB_AND_TW);
          done();
        });
    });

    test('different token', function (done) {
      Session.set('test', 123);
      Session.build()
        .then(function (token) {
          assert.notStrictEqual(token, TOKEN_FB_AND_TW, 'should return a different token');
          done();
        });
    });
  });
});
