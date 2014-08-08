'use strict';

var handlers = require('require-directory')(module);

module.exports = [
  {
    method: 'GET',
    path: '/token',
    config: handlers.find
  },
  {
    method: 'GET',
    path: '/token/{id}',
    config: handlers.findOne
  },
  {
    method: 'POST',
    path: '/token',
    config: handlers.create
  },
  {
    method: 'DELETE',
    path: '/token/{id}',
    config: handlers.delete
  }
];
