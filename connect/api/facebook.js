module.exports = {
  Post: {
    all: function (Facebook, options) {
      return Facebook.request({ url: 'me/home' });
    },
    create: function(Facebook, options) {
      return Facebook.request({ url: 'me/feed', method: 'POST', options: options});
    }
  }
}
