'use strict';

var R = require('ramda');
var server = require('../server');

module.exports = function(token, decodedToken, done) {
  // TODO: Embed the user ID in the token so we can do a join for the user?
  // TODO: `select` only a subset of fields in both queries?
  server.knex('token')
    .where('access_token', token)
    .then(R.first)
    .then(function(token) {
      if (!token) {
        return done(null, false);
      }

      return server.knex('user').where('id', token.user);
    })
    .then(R.first)
    .then(function(user) {
      if (!user) {
        return done(null, false);
      }

      done(null, true, user);
    })
    .catch(function(err) {
      console.log(err);
      done(err);
    });
};
