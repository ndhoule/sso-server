'use strict';

var Hapi = require('hapi');
var R = require('ramda');

module.exports = function(route, options) {
  return function(request, reply) {
    // Test the request against one of the whitelisted provider auth schemes
    request.server.auth.test(options.provider, request, function(err, res) {
      if (err) {
        return reply(err);
      }

      var provider = {
        provider: res.provider,
        provider_id: res.profile.id,
        raw_profile: res.profile.raw,
        refresh_token: res.refreshToken,
        secret: res.secret,
        token: res.token,
        user: request.auth.credentials.id
      };

      request.server.knex(options.table)
        .select('id')
        .where({
          provider: provider.provider,
          provider_id: provider.provider_id
        })
        .then(R.first)
        .then(function(rowId) {
          // If exists, update existing record
          if (rowId) {
            var q = request.server.knex(options.table).where(rowId).update(provider, '*');
            return q;
          }

          // Else, insert new record
          return request.server.knex(options.table).insert(provider, '*');
        })
        .then(R.first)
        .then(function(row) {
          if (!row) {
            // TODO: Handle error more nicely
            return reply(Hapi.error.internal());
          }

          // TODO: Probably don't return the provider record here
          reply(row).code(201);
        })
        .catch(function(err) {
          console.log(err);
          reply(Hapi.error.internal());
        });
    });
  };
};
