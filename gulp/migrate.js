/* eslint-env node */
'use strict';

var Knex = require('knex');
var _ = require('lodash');
var gutil = require('gulp-util');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = function(config) {
  var currentVersion = function currentVersion() {
    var knex = Knex.initialize(config.database);

    return knex.migrate.currentVersion()
      .then(function(version) {
        gutil.log('Current migration version is:', version);
      })
      .finally(function() {
        return knex.client.pool.destroy();
      });
  };

  var latest = function latest() {
    var knex = Knex.initialize(config.database);

    // If the database lives in a file (SQLite) and the database file's parent
    // directory doesn't exist, create it to prevent a Knex initialization error
    if (config.database.connection.filename) {
      mkdirp.sync(path.dirname(config.database.connection.filename));
    }

    gutil.log('Checking if any migrations need to be run...');

    return knex.migrate.latest(config.migrations)
      .spread(function(batch, migrations) {
        if (!migrations.length) {
          return gutil.log('No migrations to run.');
        }

        gutil.log('Migration batch', batch, 'run. (' + migrations.length, 'migrations)');
        _.each(migrations, function(filename) {
          gutil.log('Ran migration:', filename);
        });
      })
      .finally(function() {
        return knex.client.pool.destroy();
      });
  };

  var make = function make() {
    var knex = Knex.initialize(config.database);

    // Be sure the migrations directory exists before proceeding
    if (config.migrations.directory) {
      mkdirp.sync(config.migrations.directory);
    }

    if (!config.argv.name) {
      throw new Error('You must pass a name for the migration using the --name flag.');
    }

    return knex.migrate.make(config.argv.name, config.migrations)
      .then(function(filename) {
        gutil.log('Created migration:', path.join(config.migrations.directory, filename));
      })
      .finally(function() {
        return knex.client.pool.destroy();
      });
  };

  var rollback = function rollback() {
    var knex = Knex.initialize(config.database);

    gutil.log('Attempting to roll back last migration...');

    return knex.migrate.rollback(config.migrations)
      .spread(function(batch, migrations) {
        if (!migrations.length) {
          return gutil.log('No migrations to roll back.');
        }

        gutil.log('Migration batch', batch, 'rolled back. (' + migrations.length, 'migrations)');
        _.each(migrations, function(filename) {
          gutil.log('Rolled back migration:', filename);
        });
      })
      .finally(function() {
        return knex.client.pool.destroy();
      });
  };

  return {
    currentVersion: currentVersion,
    latest: latest,
    make: make,
    rollback: rollback
  };
};
