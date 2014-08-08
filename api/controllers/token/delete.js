'use strict';

var Hapi = require('hapi');
var Token = require('../../models').token;

var TABLE = 'token';

module.exports = {
  tags: ['api', 'token'],

  auth: 'jwt',

  validate: {
    params: {
      id: Token.schemas.all.id.required()
    }
  },

  // TODO
  //response: {
    //schema: function() {}
  //},

  // TODO: Return deleted record to user
  handler: function tokenDelete(request, reply) {
    request.server.knex(TABLE)
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
