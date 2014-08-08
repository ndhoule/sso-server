'use strict';

var Joi = require('joi');

var TABLE = 'user';

module.exports = {
  tags: ['api', 'user'],

  auth: 'jwt',

  validate: {
    params: {
      id: Joi.number().integer().min(1).required()
    }
  },

  // TODO: Return deleted record to user
  // TODO: Cascade deletion of tokens
  handler: function userDelete(request, reply) {
    request.server.knex(TABLE)
      .where('id', request.params.id)
      .delete()
      .then(function(deletedCount) {
        if (deletedCount > 1) {
          throw request.hapi.error.internal();
        }

        if (deletedCount === 0) {
          throw request.hapi.error.notFound();
        }

        reply().code(204);
      })
      .catch(function(err) {
        request.log(['error'], err);
        reply(err);
      });
  }
};
