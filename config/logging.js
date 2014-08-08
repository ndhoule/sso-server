'use strict';

var chalk = require('chalk');
var moment = require('moment');
var util = require('util');

module.exports = function(server) {
  // TODO: Better logging
  server.on('log', function logger(event /*, tags */) {
    var timestamp = util.format('[%s]:', moment(event.timestamp).format());
    console.log(chalk.blue(timestamp), event.data);
  });
};
