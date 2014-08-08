'use strict';

var Joi = require('joi');

module.exports = {
  id: {
    schema: Joi.number().integer().min(1)
  },

  updated_at: {
    schema: Joi.date()
  },

  created_at: {
    schema: Joi.date()
  },

  email: {
    schema: Joi.string().email()
  },

  name: {
    schema: Joi.string()
  },

  password: {
    private: true,
    schema: Joi.string()
               .min(6)
               .max(255)
               .regex(/[a-zA-Z]/) // Contains a letter
               .regex(/[0-9]/)    // Contains a number
               .regex(/^\S*$/)    // Contains no whitespace
               .example('testPassworD1')
               .example('test1password')
               .example('t&est1paSSword!!!')
               .description(''.concat('A password of at least 6 characters; includes >= 1 letter',
                                      'and number'))
               .required()
  },

  username: {
    schema: Joi.string()
               .min(3)
               .max(255)
               .token()            // Letters, numbers, underscores
               .regex(/^[a-zA-Z]/) // Begins with a letter
               .example('h8r')
               .example('adama')
               .example('user_name')
               .example('user_name09')
               .description(''.concat('A username consisting of at least 3 characters, containing',
                                      'letters, numbers, or underscores. Must begin with a letter'))
  }
};
