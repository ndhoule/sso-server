'use strict';

module.exports = {
  tags: ['api', 'auth'],

  auth: 'jwt',

  handler: {
    linkProvider: {
      provider: 'google',
      table: 'provider'
    }
  }
};
