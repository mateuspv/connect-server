var Post = require('./handlers/post');

module.exports = [
  {
    method: 'GET',
    path: '/connect/post',
    handler: Post.all
  },
  {
    method: 'POST',
    path: '/connect/post',
    handler: Post.create
  },
]
