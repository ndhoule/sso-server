'use strict';

var Joi = require('joi');
var User = require('../../models').user;

var TABLE = 'user';

module.exports = {
  tags: ['api', 'user'],

  auth: 'jwt',

  validate: {
    query: Joi.object().keys(User.schemas.public)
  },

  response: {
    schema: Joi.array().includes(Joi.object().keys(User.schemas.public))
  },

  handler: function userFind(request, reply) {
    request.server.knex(TABLE)
      .select(User.columns.public)
      .where(request.query)
      .then(reply)
      .catch(function(err) {
        request.log(['error'], err);
        reply(err);
      });
  }
};
