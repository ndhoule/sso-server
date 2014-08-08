'use strict';

var Promise = require('bluebird');
var R = require('ramda');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var server = require('../server');

module.exports = function validateSimpleAuth(username, password, done) {
  server.knex('user')
    .where('username', username)
    .then(R.first)
    .then(function(user) {
      if (!user) {
        return done(null, false);
      }

      return bcrypt.compareAsync(password, user.password)
        .then(function(isValid) {
          done(null, isValid, R.omit(['password'], user));
        });
    })
    .catch(done);
};
