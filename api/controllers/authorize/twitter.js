'use strict';

module.exports = {
  tags: ['api', 'auth'],

  auth: 'jwt',

  handler: {
    linkProvider: {
      provider: 'twitter',
      table: 'provider'
    }
  }
};
