'use strict';

var Hapi = require('hapi');
var Promise = require('bluebird');
var R = require('ramda');
var _ = require('lodash');

var validator = function validator(request, next) {
  request.server.knex('role')
    .where('id', request.auth.credentials.role)
    .first()
    .then(function(role) {
      // The user is in an abnormal state
      if (!role) {
        return Hapi.error.internal();
      }

      // TODO: Validate rule schema so rules can never be anything except
      // `Boolean|Function|Array[Function]`
      var rule = request.route.plugins.acl.rules[role.name];

      var deferred = Promise.defer();

      // TODO: Allow an array of rules?
      // If the rule is a function, evaluate it
      if (_.isFunction(rule)) {
        // Allow the rule to be resolved asynchronously by passing it a
        // `next` callback. The `next` callback is resolved with two
        // arguments, `err` and `result`.
        rule.call(null, request, function(err, result) {
          if (err !== undefined) {
            return deferred.reject(err);
          }
          // TODO: Check to be sure the returned value is a boolean
          deferred.resolve(result === undefined ? true : result);
        });
      } else {
        // TODO: At this point, it should be a boolean. Use Joi to check?
        deferred.resolve(rule);
      }

      deferred.promise
        .then(function(res) {
          // If the resolution value is falsy, reject
          if (!res) {
            return Promise.reject(res);
          }

          // Proceed to request/next middleware
          next();
        })
        .catch(function() {
          next(Hapi.error.unauthorized());
        });
    });
};

exports.register = function registerAclPlugin(plugin, options, next) {
  plugin.ext('onPostAuth', function(request, next) {
    // If this route doesn't have ACL rules configured, skip this middleware
    if (!R.path('route.plugins.acl.rules', request)) {
      return next();
    }

    // If the user is not logged in, reject them outright
    if (!request.auth.isAuthenticated) {
      return next(Hapi.error.unauthorized());
    }

    plugin.log(['acl', 'debug'], 'Running permissions plugin on route', request.route.path);

    // TODO: Make this configurable
    validator(request, next);
  });

  next();
};

exports.register.attributes = {
  name: 'acl'
};










/**
 * Plan:
 *
 * - By default, rejects if `request.auth.isAuthenticated` is not `true`
 * - Needs a way to get the user
 *   - Configurable function
 *   - By default, uses `request.auth.credentials.id`, if it exists
 * - Needs a way to get the user's roles
 *   - Configurable function
 *   - By default, uses `request.auth.credentials.roles`, if it exists
 *
 * TODO:
 * - Join `roles` onto `user` object on serialization
 * - Validate all route roles against database roles
 * - Validate `acl` schema
 * - Allow multiple rules (each `rule` field can take a boolean, fn, or array fns)
 * - Allow rules to have a '*' field, which applies to any user
 * - Change `rules` to `allow` and `deny`
 * - Allow default rules
 * - Allow checker function to be customized
 * - Caching?
 */

// TODO: This would allow for us to create schemas based on role names
//plugin.dependency('knex', function(plugin, next) {
  //plugin.plugins.knex('role')
    //.select('*')
    //.then(function([> results <]) {
      //next();
    //})
    //.catch(next);
//});


/**
 * Sample ACL rules:
 */

//plugins: {
  //acl: {
    //rules: {
      //admin: true,
      //user: function(request, next) {
        //if (request.auth.credentials.id === +request.params.id) {
          //return next();
        //}
        //next(false);
      //}
    //}
  //}
//},
