var assert = require('chai').assert;
var SessionBase = require('./../../../../api/auth/helpers/session');

suite('Session', function (argument) {
  var Session;

  setup(function() {
    // TOKEN --> { facebook: { token: 'x' }, twitter: { token: 'x', secret: 'z' }
    var TOKEN_FB_AND_TW = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmYWNlYm9vayI6eyJ0b2tlbiI6IngifSwidHdpdHRlciI6eyJ0b2tlbiI6IngiLCJzZWNyZXQiOiJ6In0sImlhdCI6MTQyNzA5OTc5NH0.CZP8vJM_U0zxBSuBfnMe6lSerPcRXwmHgZsa_s319fg';
    Session = new SessionBase(TOKEN_FB_AND_TW);
  });

  test('#set', function (done) {
    Session
      .set('test', '123');

    Session
      .get()
      .then(function (session) {
        assert.equal(session.test, '123', 'should be seted values');
        done();
      });
  });

  test('#merge', function (done) {
    var obj = { facebook: {token: 'fb' } };

    Session
      .merge(obj);

    Session
      .get()
      .then(function (session) {
        assert.deepEqual(session.facebook, {token: 'fb'}, 'should contain the new field');
        done();
      });
  });

  test('#serialize', function (done) {
    var result;

    Session
      .set('test', '123');

    Session
      .serialize()
      .then(function (token) {
        var OtherSession = new SessionBase(token);
        assert.isString(token);
        OtherSession
          .get()
          .then(function (session) {
            assert.equal(session.test, '123', 'the generated token have expected properties');
            done();
          });
      });
  });
});
