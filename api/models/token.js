'use strict';

var Joi = require('joi');
var R = require('ramda');
var user = require('./user');

var schemas = {};

schemas.id = Joi.number().integer().min(1);
// FIXME: Validate tokens correctly
schemas.access_token = Joi.any();
schemas.created_at = Joi.date();
schemas.expires_at = Joi.date();
schemas.updated_at = Joi.date();
// XXX
schemas.user = Joi.alternatives().try(
  Joi.number().integer().min(1),
  user.schemas.public
);

// A list of database rows that should never be exposed to API consumers
var privateColumns = [];

// A list of keys that can be exposed to API consumers
var publicColumns = R.compose(R.keys, R.omit(privateColumns))(schemas);

module.exports = {
  privateColumns: privateColumns,
  publicColumns: publicColumns,
  schemas: {
    raw: schemas,
    default: Joi.object().keys(schemas),
    public: Joi.object().keys(R.pick(publicColumns, schemas))
  }
};
