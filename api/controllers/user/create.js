'use strict';

var Promise = require('bluebird');
var R = require('ramda');
var _ = require('lodash');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var User = require('../../models').user;

var TABLE = require('path').basename(__dirname);

// TODO: What happens when the user omits either the username or password? Does this break?
// TODO: Move into a library file
var decodeAuthorizationHeader = function decodeAuthorizationHeader(header) {
  var authBuffer = header.split(' ')[1];
  var credentials = new Buffer(authBuffer, 'base64').toString().split(':');

  return {
    username: credentials[0],
    password: credentials[1]
  };
};

module.exports = {
  tags: ['api', 'user'],

  validate: {
    headers: function(headers, options, next) {
      // If the `Authorization` header is defined, decode it from its base64
      // string and add it to the request payload. `headers` is validated before
      // `payload`, so the latter will handle username/password validation.
      if (_.has(headers, 'authorization')) {
        var credentials = decodeAuthorizationHeader(headers.authorization);
        options.context.payload.username = credentials.username;
        options.context.payload.password = credentials.password;
      }

      next(null, headers);
    },

    payload: {
      email: User.schemas.all.email.required(),
      name: User.schemas.all.name.required(),
      password: User.schemas.all.password.required(),
      username: User.schemas.all.username.required()
    }
  },

  handler: function userFind(request, reply) {
    bcrypt.hashAsync(request.payload.password, 8)
      .then(function(hashedPassword) {
        var user = _.defaults({ password: hashedPassword }, request.payload);

        request.server.knex(TABLE)
          .insert(user)
          .returning('id')
          .then(R.first)
          .then(function(id) {
            if (!id) {
              return reply(request.hapi.error.internal());
            }

            // TODO: Reply with a JWT?
            reply()
              .code(201)
              .header('Location', request.url.pathname + '/' + id);
          })
          .catch(function(err) {
            // Database error
            // TODO: Abstract this out into an error generator/library file
            var response = request.hapi.error.conflict('Database Error', err);
            response.output.payload.detail = {
              message: err.message,
              source: err.detail
            };
            reply(response);
          });
      })
      .catch(function(err) {
        // Error hashing password
        request.log(['error'], err);
        reply(request.hapi.error.internal());
      });
  }
};
