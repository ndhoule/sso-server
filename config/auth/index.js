'use strict';

var _ = require('lodash');

module.exports = function(server) {
  /**
   * Local Strategies
   */
  server.auth.strategy('basic', 'basic', {
    validateFunc: require('./basic')
  });

  server.auth.strategy('jwt', 'jwt', {
    key: server.settings.app.auth.jwt.secret,
    validateFunc: require('./jwt')
  });

  /**
   * Third-Party Strategies
   */
  server.auth.strategy('github', 'bell', _.extend({
    provider: 'github'
  }, server.settings.app.auth.github));

  server.auth.strategy('google', 'bell', _.extend({
    provider: 'google'
  }, server.settings.app.auth.google));

  server.auth.strategy('facebook', 'bell', _.extend({
    provider: 'facebook'
  }, server.settings.app.auth.facebook));

  server.auth.strategy('twitter', 'bell', _.extend({
    provider: 'twitter'
  }, server.settings.app.auth.twitter));
};
