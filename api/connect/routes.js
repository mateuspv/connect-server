var Joi = require('joi');

var Post = require('./handlers/post');
var Search = require('./handlers/search');
var Profile = require('./handlers/profile');
var Friends = require('./handlers/friends');
var Group = require('./handlers/group');

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
    method: 'PUT',
    path: '/connect/posts/{id}',
    handler: Post.like
  },
  {
    method: 'GET',
    path: '/connect/search',
    handler: Search.query,
    config: {
      validate: {
        query: {
          q: Joi.any().required(),
          type: Joi.any().required(),
          network: Joi.any().required(),
          token: Joi.string()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/connect/profiles',
    handler: Profile.get,
    config: {
      validate: {
        query: {
          id: Joi.string().required(),
          network: Joi.string().required().valid(['twitter', 'facebook']),
          token: Joi.string(),
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/connect/friends',
    handler: Friends.all,
  },
  {
    method: 'GET',
    path: '/connect/groups/{id}',
    handler: Group.find
  },
]
