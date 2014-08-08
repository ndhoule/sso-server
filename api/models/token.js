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

  expires_at: {
    schema: Joi.date()
  },

  access_token: {
    // TODO: Validate properly
    schema: Joi.any()
  },

  user: {
    // TODO: But this could also be a fully populated user model
    schema: Joi.number().integer().min(1)
  }
};
