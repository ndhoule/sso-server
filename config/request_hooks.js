'use strict';

var camelize = require('camelize');
var snakeize = require('snakeize');

module.exports = function(server) {
  /**
   * Translate snake-case keys to camel-case keys, and vice versa. This allows
   * the client to work with camelized keys as expected (or with snake case, if
   * they prefer), and allows us to avoid all the problems that come with using
   * camelized keys in Postgres.
   *
   * TODO: Allow user to bypass camelization?
   * TODO: Check if sending JSON? This might process e.g. HTML responses?
   * TODO: Test these thoroughly
   */
  server.ext('onPostAuth', function(request, next) {
    if (request.method === 'post') {
      request.payload = snakeize(request.payload);
    }
    next();
  });

  server.ext('onPreResponse', function(request, next) {
    request.response.source = camelize(request.response.source);
    next();
  });

  server.ext('onPostHandler', function(request, next) {
    if (request.query.pretty) {
      request.response.spaces(2);
    }
    next();
  });
};
