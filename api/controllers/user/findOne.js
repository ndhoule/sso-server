'use strict';

var Hapi = require('hapi');
var Joi = require('joi');
var User = require('../../models').user;

var TABLE = 'user';

module.exports = {
  tags: ['api', 'user'],

  auth: 'jwt',

  validate: {
    params: {
      id: User.schemas.all.id
    }
  },

  response: {
    schema: Joi.object().keys(User.schemas.public)
  },

  handler: function userFind(request, reply) {
    request.server.knex(TABLE)
      .select(User.fields.public)
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
