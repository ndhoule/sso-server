'use strict';

module.exports = {
  tags: ['api', 'auth'],

  auth: 'jwt',

  handler: {
    linkProvider: {
      provider: 'github',
      table: 'provider'
    }
  }
};
