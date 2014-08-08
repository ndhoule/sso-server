'use strict';

var Hapi = require('hapi');
var Joi = require('joi');
var Token = require('../../models').token;

var TABLE = 'token';

module.exports = {
  tags: ['api', 'user'],

  validate: {
    params: {
      id: Token.schemas.all.id
    }
  },

  response: {
    schema: Joi.object().keys(Token.schemas.public)
  },

  handler: function tokenFindOne(request, reply) {
    request.server.knex(TABLE)
      .select(Token.columns.public)
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
