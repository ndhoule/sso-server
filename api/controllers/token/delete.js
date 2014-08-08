'use strict';

var Hapi = require('hapi');
var Joi = require('joi');

var table = 'token';

module.exports = {
  tags: ['api', 'token'],

  validate: {
    params: {
      id: Joi.number().integer().min(1).required()
    },
    query: {
      pretty: Joi.boolean().default(false)
    }
  },

  // TODO: Return deleted record to user
  handler: function tokenDelete(request, reply) {
    request.server.knex(table)
      .where('id', request.params.id)
      .delete()
      .then(function(numDeleted) {
        // Assuming the `WHERE` restriction above works, this should not happen
        if (numDeleted > 1) {
          return reply(Hapi.error.internal());
        }

        if (numDeleted === 0) {
          return reply(Hapi.error.notFound());
        }

        reply().code(204);
      })
      .catch(function() {
        reply(Hapi.error.internal());
      });
  }
};
