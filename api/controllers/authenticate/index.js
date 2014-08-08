'use strict';

var handlers = require('require-directory')(module);

module.exports = [
  {
    method: 'POST',
    path: '/authenticate',
    config: handlers.create
  }
];
