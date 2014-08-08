'use strict';

var Joi = require('joi');
var Token = require('../../models').token;

var TABLE = 'token';

module.exports = {
  tags: ['api', 'user'],

  auth: 'jwt',

  validate: {
    query: Joi.object().keys(Token.schemas.public)
  },

  response: {
    schema: Joi.array().includes(Token.schemas.public)
  },

  handler: function tokenFind(request, reply) {
    request.server.knex(TABLE)
      .select(Token.columns.public)
      .where(request.query)
      .then(reply)
      .catch(function(err) {
        request.log(['error'], err);
        reply(err);
      });
  }
};
