'use strict';

var Joi = require('joi');

module.exports = {
  id: {
    schema: Joi.number().integer().min(1)
  },

  created_at: {
    schema: Joi.date()
  },

  updated_at: {
    schema: Joi.date()
  },

  name: {
    schema: Joi.string()
  }
};
