var assert = require('chai').assert;
var Hapi = require('hapi');
var SessionModule = require('./../../../../api/_session/index');

/**
 * Helpers
 */
var createServer = function (cb) {
  var Server = new Hapi.Server();
  Server.connection();

  Server.route({
    method: ['GET', 'POST'],
    path: '/',
    handler: function (request, reply) {
      var Session = request.session.get();
      Session
        .then(function (session) {
          reply({session: session});
        })
        .catch(function (err) {
          throw err;
        });
    }
  });

  Server.register([{ register: require('hapi-auth-jwt2') }, { register: SessionModule}], function (err) {
    if (err) {
      throw err;
    }

    Server.start(function () {
      return cb(Server);
    });
  });
};

suite('Integrate `Session` with Server', function() {
  var TW_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0d2l0dGVyIjp7InRva2VuIjoiODE0NDE4NjgtUDBoMERRODJnWXE4NlRONm9rc0xMalFVM2FTckpNSmU4VjRWcm84amIiLCJzZWNyZXQiOiI5a1pEV3hXQ29WNGFLTm9leUlINW1jcWVZWHJLSExUUm5nRzExdXhFTlZOcE8ifSwiaWF0IjoxNDI4MDEzMjYwfQ.9kP03NfaCuI5vg0ZdTIux2dmvYqv3ONjiZlyjRXLOPI';
  var DECRYPTED_TOKEN = { twitter: { token: '81441868-P0h0DQ82gYq86TN6oksLLjQU3aSrJMJe8V4Vro8jb', secret: '9kZDWxWCoV4aKNoeyIH5mcqeYXrKHLTRngG11uxENVNpO' }, iat: 1428013260 };
  var Server;

  setup(function (done) {
    createServer(function (server) {
      Server = server;
      done();
    });
  });

  teardown(function (done) {
    Server.stop(undefined, done);
  });

  test('Without token', function (done) {
    Server.inject('/', function (res) {
      assert.strictEqual(res.headers.token, '', 'token always on headers');
      assert.deepEqual(res.result, {session: {}}, 'Should return empty object');
      done();
    });
  });

  test('With token passed by query params', function (done) {
    Server.inject('/?token=' + TW_TOKEN, function (res) {
      assert.strictEqual(res.headers.token, TW_TOKEN, 'token always on headers');
      assert.deepEqual(res.result, {session: DECRYPTED_TOKEN});
      done();
    });
  });

  test('With token passed by payload', function (done) {
    Server.inject({ url: '/', method: 'POST', payload: JSON.stringify({token: TW_TOKEN})}, function (res) {
      assert.strictEqual(res.headers.token, TW_TOKEN, 'token always on headers');
      assert.deepEqual(res.result, {session: DECRYPTED_TOKEN});
      done();
    });
  });
});
