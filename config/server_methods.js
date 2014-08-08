'use strict';

var Joi = require('joi');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var moment = require('moment');

module.exports = function(server) {
  var JWT_SETTINGS = server.settings.app.auth.jwt;

  var userPayloadSchema = Joi.object().keys({
    sub: Joi.number().integer().min(1).required()
  });

  // TODO: Modularize this function
  server.method('createJwt', function(userPayload, next) {
    userPayloadSchema.validate(userPayload, function(err) {
      if (err) {
        return next(server.hapi.error.internal());
      }
    });

    // The payload of the token, to be encrypted
    // TODO: Verify that `iss`, `aud` are correct
    // FIXME: `iss` won't work when behind a reverse proxy (e.g. nginx)
    var payload = _.defaults({}, userPayload, {
      aud: server.info.uri,
      exp: moment().add(JWT_SETTINGS.expireTime, 'minutes').valueOf(),
      iat: moment().valueOf(),
      iss: JWT_SETTINGS.issuer
    });

    // The encrypted token
    var token = jwt.sign(payload, JWT_SETTINGS.secret);

    // The token, as stored in the database
    var record = {
      access_token: token,
      expires_at: moment(payload.exp).toDate(),
      user: payload.sub
    };

    server.knex('token')
      .insert(record)
      .then(function(result) {
        if (!result.rowCount) {
          throw server.hapi.error.internal();
        }

        next(null, {
          access_token: token,
          expires_at: record.expires_at,
          type: 'jwt'
        });
      })
      .catch(next);
  });
};
