var assert = require('chai').assert;
var networkBuilder = require('./../../../../api/connect/providers/index');

suite('Network Builder', function() {
  var FAKE_NETWORKS;
  var FAKE_KEYS;

  setup(function() {
    FAKE_NETWORKS = require('./_mock-providers');
    FAKE_KEYS = require('./_mock-keys');
  });

  suite('initialize', function() {
    test('with unknown network', function() {
      var expectedError = /NetworkBuilder unknown provider google/;
      var buildGoogle = function() {
        networkBuilder('google', FAKE_KEYS);
      };

      assert.throws(buildGoogle, expectedError);
    });

    test('build with a single network', function () {
      var Facebook = networkBuilder('facebook', FAKE_KEYS, FAKE_NETWORKS);
      assert.isObject(Facebook);
    });

    test('build with multiples networks', function () {
      var Providers = networkBuilder(['facebook', 'twitter'], FAKE_KEYS, FAKE_NETWORKS);
      assert.isObject(Providers);
    });
  });

  test('Call a method from single network', function (done) {
    var Obj = {hello: 'world'};
    var Provider = networkBuilder(['facebook'], FAKE_KEYS, FAKE_NETWORKS);

    Provider.Like.create(Obj)
      .then(function (result) {
        assert.isArray(result);
        assert.lengthOf(result, 1);
        assert.deepEqual(result[0], Obj);
        done();
      });
  });

  test('Call a method from multiples networks', function (done) {
    var Obj = {hello: 'world'};
    var Provider = networkBuilder(['facebook', 'twitter'], FAKE_KEYS, FAKE_NETWORKS);

    Provider.Like.create(Obj)
      .then(function (result) {
        assert.isArray(result);
        assert.lengthOf(result, 2);
        assert.deepEqual(result[0], Obj);
        assert.deepEqual(result[1], Obj);
        done();
      });
  });
});
