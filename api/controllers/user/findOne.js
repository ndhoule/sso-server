'use strict';

var Hapi = require('hapi');
var Joi = require('joi');
var R = require('ramda');
var user = require('../../models/user');

var table = 'user';

var apiOptionsSchema = {
  fields: Joi.array().includes(Joi.string().valid(user.publicColumns)).default(user.publicColumns),
  pretty: Joi.boolean().default(false)
};

module.exports = {
  tags: ['api', 'user'],

  auth: 'jwt',

  validate: {
    params: { id: user.schemas.raw.id },

    // In addition to any public user fields, validate API options
    query: user.schemas.public.concat(Joi.object().keys(apiOptionsSchema))
  },

  response: {
    schema: user.schemas.public
  },

  handler: function userFind(request, reply) {
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
