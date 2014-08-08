'use strict';

var Hapi = require('hapi');
var _ = require('lodash');

var host = process.env.HOST || 'localhost';
var port = process.env.PORT || 9001;

// TODO: Validate options (e.g. check to be sure `cors.origin` is not set to '*' in production mode)
var defaultConfig = require('./defaults');
var userConfig = require('../api/environments/development');

module.exports = Hapi.createServer(host, port, _.merge(defaultConfig, userConfig));
