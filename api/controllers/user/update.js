'use strict';

var R = require('ramda');
var Joi = require('joi');

var table = 'user';
var columnWhitelist = ['id', 'created_at', 'updated_at', 'name', 'username', 'email'];

module.exports = {
  tags: ['api', 'user'],

  auth: 'jwt',

  validate: {
    // FIXME: Validate payload properly
    payload: {
      name: Joi.any(),
      email: Joi.any()
    },

    params: {
      id: Joi.number().integer().min(1).required()
    }
  },

  handler: function userFind(request, reply) {
    request.server.knex(table)
      .where('id', request.params.id)
      .returning(columnWhitelist)
      .update(request.payload)
      .then(function(rowsUpdated) {
        if (R.isEmpty(rowsUpdated)) {
          throw request.hapi.error.notFound();
        }

        reply(R.first(rowsUpdated));
      })
      .catch(function(err) {
        request.log(['error'], err);
        reply(err);
      });
  }
};
