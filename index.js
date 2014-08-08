'use strict';

var server = require('./config/server');
var util = require('util');

var packs = [
  { plugin: require('bell') },
  { plugin: require('hapi-auth-basic') },
  { plugin: require('hapi-auth-jsonwebtoken') },
  { plugin: require('./lib/plugins/acl') },
  { plugin: require('./lib/plugins/knex'), options: server.settings.app.knex },
  { plugin: require('./lib/plugins/kue'), options: server.settings.app.kue }
];

server.pack.register(packs, function(err) {
  if (err) {
    throw err;
  }

  /**
   * Logging
   */
  require('./config/logging')(server);

  /**
   * Request Preprocessing
   */
  require('./config/request_hooks')(server);

  /**
  * Server Methods
  *
  * TODO: Move this elsewhere
  */
  require('./config/server_methods')(server);

  /**
   * Authentication
   */
  require('./config/auth')(server);

  /**
   * Routes
   */
  require('./config/routes')(server);

  /**
   * Boot
   */
  server.start(function() {
    server.log(['startup'], util.format('Hapi server started @ %s', server.info.uri));
  });
});
