'use strict';

var _ = require('lodash');
var knex = require('knex');

exports.register = function registerKnex(plugin, options, next) {
  // Initialize a Knex connection
  var conn = knex(options);

  // Add a reference to the connection to all servers
  _.each(plugin.servers, function(server) {
    server.knex = conn;
  });

  // Expose Knex as a plugin. Do this directly instead of through
  // `plugin.expose` because we have no other keys to expose.
  plugin.plugins[exports.register.attributes.name] = conn;

  next();
};

exports.register.attributes = {
  name: 'knex'
};
