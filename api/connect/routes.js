var Post = require('./handlers/post');

module.exports = [
  {
    method: 'GET',
    path: '/connect/posts',
    handler: Post.all
  },
  {
    method: 'POST',
    path: '/connect/posts',
    handler: Post.create
  },
]
