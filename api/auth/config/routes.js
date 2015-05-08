var Joi = require('joi');
var Auth = require('../handlers/auth');
var withToken = {
  validate: {
    query: {
      token: Joi.string().min(10)
    }
  }
};

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
    method: ['GET', 'POST'],
    path: '/auth/status',
    handler: Auth.status,
    config: withToken
  },
  {
    method: 'GET',
    path: '/auth/user',
    handler: Auth.user,
  }
];
