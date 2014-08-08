'use strict';

var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

var tls = null;
var key, cert;

try {
  key = fs.readFileSync(path.resolve(__dirname, '../api/ssl/server.key'));
  cert = fs.readFileSync(path.resolve(__dirname, '../api/ssl/server.crt'));
} catch (e) {
  var warning = chalk.red('WARNING: ');
  console.warn(warning.concat('Unable to find SSL key/certificate at `%s`.'), e.path);
  console.warn(warning.concat('Running server in HTTP mode. This is insecure!'));

  if (!process.env.hasOwnProperty('FORCE_NO_SSL') && process.env.NODE_ENV === 'production') {
    var errorMessage = ''.concat('If you\'re sure you want to run the server without SSL, set the',
                                 '`FORCE_NO_SSL` environment variable and restart the server.');
    throw new Error(errorMessage);
  }
}

if (key && cert) {
  tls = {
    key: key,
    cert: cert
  };
}

module.exports = tls;
