module.exports = {
  Post: {
    all: function (Twitter, options) {
      return Twitter.request({ url: 'statuses/home_timeline' });
    },
    create: function (Twitter, options) {
      return Twitter.request({url: 'statuses/update', method: 'POST', options: {status: options.message}})
    }
  }
};
