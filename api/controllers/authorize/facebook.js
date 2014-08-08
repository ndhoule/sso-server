'use strict';

module.exports = {
  tags: ['api', 'auth'],

  auth: 'jwt',

  handler: {
    linkProvider: {
      provider: 'facebook',
      table: 'provider'
    }
  }
};
