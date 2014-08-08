'use strict';

var controllers = require('../api/controllers');

module.exports = function(server) {
  server.route(controllers.authenticate);
  server.route(controllers.authorize);
  server.route(controllers.token);
  server.route(controllers.user);
};
