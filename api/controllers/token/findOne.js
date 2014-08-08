'use strict';

var Hapi = require('hapi');
var Joi = require('joi');
var R = require('ramda');
var token = require('../../models/token');

var table = 'token';

var apiOptionsSchema = {
  fields: Joi.array()
    .includes(Joi.string().valid(token.publicColumns))
    .default(token.publicColumns),
  pretty: Joi.boolean().default(false)
};

module.exports = {
  tags: ['api', 'user'],

  validate: {
    params: { id: token.schemas.raw.id },

    // In addition to any public user fields, validate API options
    query: Joi.object().keys(apiOptionsSchema).concat(token.schemas.public)
  },

  response: {
    schema: token.schemas.public
  },

  handler: function tokenFindOne(request, reply) {
    request.server.knex(table)
      .select(R.uniq(request.query.fields))
      .where('id', request.params.id)
      .first()
      .then(function(record) {
        if (!record) {
          throw Hapi.error.notFound();
        }

        reply(record);
      })
      .catch(function(err) {
        request.log(['error'], err);
        reply(err);
      });
  }
};
