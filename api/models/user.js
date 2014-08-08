'use strict';

var Joi = require('joi');
var R = require('ramda');

var schemas = {};

schemas.username = Joi.string()
  .min(3)
  .max(255)
  .token()            // Letters, numbers, underscores
  .regex(/^[a-zA-Z]/) // Begins with a letter
  .example('h8r')
  .example('adama')
  .example('user_name')
  .example('user_name09')
  .description('A username consisting of at least 3 characters, containing' +
               'letters, numbers, or underscores. Must begin with a letter');

// TODO: Validate symbols against a whitelist of symbols
// TODO: Require at least one symbol
schemas.password = Joi.string()
  .min(6)
  .max(255)
  .regex(/[a-zA-Z]/) // Contains a letter
  .regex(/[0-9]/)    // Contains a number
  .regex(/^\S*$/)    // Contains no whitespace
  .example('testPassworD1')
  .example('test1password')
  .example('t&est1paSSword!!!')
  .description('A password of >= 6 characters; includes at least one letter and number')
  .required();

schemas.created_at = Joi.date();
schemas.updated_at = Joi.date();
schemas.email = Joi.string().email();
schemas.id = Joi.number().integer().min(1);
schemas.name = Joi.string();

// A list of database rows that should never be exposed to API consumers
var privateColumns = ['password'];

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
