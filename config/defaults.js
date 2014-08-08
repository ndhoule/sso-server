'use strict';

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  app: {
    auth: {
      jwt: {
        // In minutes
        expireTime: 60 * 24,
        issuer: 'sso'
      }
    },

    knex: {
      client: 'pg',
      connection: {
        host: '127.0.0.1',
        user: process.env.USER,
        password: ''
      }
    },

    kue: {
      prefix: 'sso'
    }
  },

  cors: isProduction ? false : {
    origin: ['*'],
    additionalExposedHeaders: ['Location']
  },

  tls: require('./load_ssl')
};
