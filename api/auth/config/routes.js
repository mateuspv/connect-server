var Joi = require('joi');
var Auth = require('../handlers/auth');

module.exports = [
  {
    method: ['GET', 'POST'],
    path: '/auth/facebook',
    config: {
      auth: 'facebook',
      handler: Auth.authentication
    }
  },
  {
    method: ['GET', 'POST'],
    path: '/auth/twitter',
    config: {
      auth: 'twitter',
      handler: Auth.authentication
    }
  },
  {
    method: 'GET',
    path: '/auth/status',
    handler: Auth.status,
    config: {
      validate: {
        query: {
          token: Joi.string().min(10)
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/auth/check',
    handler: Auth.check
  }
];
