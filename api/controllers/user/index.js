'use strict';

var handlers = require('require-directory')(module);

module.exports = [
  {
    method: 'GET',
    path: '/user',
    config: handlers.find
  },
  {
    method: 'GET',
    path: '/user/{id}',
    config: handlers.findOne
  },
  {
    method: 'POST',
    path: '/user',
    config: handlers.create
  },
  {
    method: 'PUT',
    path: '/user/{id}',
    config: handlers.update
  },
  {
    method: 'DELETE',
    path: '/user/{id}',
    config: handlers.delete
  }
];
