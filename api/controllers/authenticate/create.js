'use strict';

module.exports = {
  tags: ['api', 'token'],

  auth: 'basic',

  handler: function authenticateCreate(request, reply) {
    var userId = request.auth.credentials.id;

    request.server.methods.createJwt({ sub: userId }, function(err, token) {
      if (err) {
        return reply(err);
      }

      reply(token);
    });
  }
};
