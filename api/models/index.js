'use strict';

var R = require('ramda');
var _ = require('lodash');

var models = require('require-directory')(module);

module.exports = R.mapObj(function(model) {
  var privateColumns = _.reduce(model, function(acc, value, columnName) {
    return value.private ? acc.concat(columnName) : acc;
  }, []);

  var publicColumns = _.reduce(model, function(acc, value, columnName) {
    return value.private ? acc : acc.concat(columnName);
  }, []);

  var allSchemas = R.mapObj(R.get('schema'), model);
  var publicSchemas = R.pick(publicColumns, allSchemas);
  var privateSchemas = R.pick(privateColumns, allSchemas);

  return {
    _raw: model,

    columns: {
      all: R.keys(model),
      private: privateColumns,
      public: publicColumns
    },

    schemas: {
      all: allSchemas,
      private: privateSchemas,
      public: publicSchemas
    },

    sanitize: function(model) {
      return R.pick(publicColumns, model);
    }
  };
}, models);
