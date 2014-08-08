'use strict';

var handlers = require('require-directory')(module);
var server = require('../../../config/server');

server.handler('linkProvider', handlers.lib.handler);

module.exports = [
  {
    method: ['POST', 'GET'],
    path: '/authorize/github',
    config: handlers.github
  },
  {
    method: ['POST', 'GET'],
    path: '/authorize/google',
    config: handlers.google
  },
  {
    method: ['POST', 'GET'],
    path: '/authorize/facebook',
    config: handlers.facebook
  },
  {
    method: ['POST', 'GET'],
    path: '/authorize/twitter',
    config: handlers.twitter
  }
];
