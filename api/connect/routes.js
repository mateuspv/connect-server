var Joi = require('joi');

var Post = require('./handlers/post');
var Search = require('./handlers/search');

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
  {
    method: 'GET',
    path: '/connect/search',
    handler: Search.query,
    config: {
      validate: {
        query: {
          q: Joi.any().required(),
          token: Joi.any().optional()
        }
      }
    }
  }
]
