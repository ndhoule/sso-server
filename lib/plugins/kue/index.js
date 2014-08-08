'use strict';

var kue = require('kue');

// TODO: Expose more configuration objects
exports.register = function registerKuePlugin(plugin, options, next) {
  // Expose Kue as a plugin. Do this directly instead of through
  // `plugin.expose` because we have no other keys to expose.
  plugin.plugins[exports.register.attributes.name] = kue.createQueue(options);

  next();
};

exports.register.attributes = {
  name: 'kue'
};
