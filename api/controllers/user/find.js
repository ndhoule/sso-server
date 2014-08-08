'use strict';

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
    // In addition to any public user fields, validate API options
    query: Joi.object().keys(apiOptionsSchema).concat(user.schemas.public)
  },

  response: {
    schema: Joi.array().includes(user.schemas.public)
  },

  handler: function userFind(request, reply) {
    request.server.knex(table)
      .select(R.uniq(request.query.fields))
      .where(R.omit(R.keys(apiOptionsSchema), request.query))
      .then(function(records) {
        reply(records);
      })
      .catch(function(err) {
        request.log(['error'], err);
        reply(err);
      });
  }
};
