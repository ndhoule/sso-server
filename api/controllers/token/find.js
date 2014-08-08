'use strict';

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
    schema: Joi.array().includes(token.schemas.public)
  },

  handler: function tokenFind(request, reply) {
    request.server.knex(table)
      .select(R.uniq(request.query.fields))
      .where(R.omit(R.keys(apiOptionsSchema), request.query))
      .then(reply)
      .catch(function(err) {
        request.log(['error'], err);
        reply(err);
      });
  }
};
