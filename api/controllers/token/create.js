'use strict';

var Hapi = require('hapi');
var R = require('ramda');
var jwt = require('jsonwebtoken');

var table = 'token';

module.exports = {
  description: 'An endpoint for creating new tokens.',
  tags: ['api', 'token'],

  auth: 'jwt',

  // TODO: Validate?
  //validate: {},

  handler: function tokenFind(request, reply) {
    var JWT_EXPIRE_TIME = request.server.settings.app.auth.jwt.expireTime;
    var JWT_SECRET = request.server.settings.app.auth.jwt.secret;

    // TODO: Populate token body
    // TODO: Move into a utility file
    var token = jwt.sign({}, JWT_SECRET, { expiresInMinutes: JWT_EXPIRE_TIME });
    var decoded;
    jwt.verify(token, JWT_SECRET, function(err, decodedToken) {
      if (err) {
        throw err;
      }
      decoded = decodedToken;
    });

    var record = {
      // Convert seconds since UNIX epoch -> timestamp
      expires_at: new Date(decoded.exp * 1000),
      token: token,
      user: 5 // XXX: Should be assigned to current user
    };

    request.server.knex(table).insert(record, '*')
      .then(R.first)
      .then(function(token) {
        if (!token) {
          throw new Error('No records created.');
        }

        reply(token);
      })
      .catch(function(err) {
        request.log(['error'], err);
        reply(Hapi.error.internal());
      });
  }
};
