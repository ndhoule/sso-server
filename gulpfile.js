'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var path = require('path');

var env = process.env.NODE_ENV || 'development';
var argv = require('minimist')(process.argv.slice(2));

var config = {
  argv: argv,
  database: require('./api/environments/' + env).app.knex,
  migrations: {
    pool: { max: 1 },
    directory: path.resolve(__dirname, './api/migrations')
  }
};

/**
 * Database
 */

var migrate = require('./gulp/migrate')(config);

gulp.task('migrate:currentVersion', migrate.currentVersion);
gulp.task('migrate:latest', migrate.latest);
gulp.task('migrate:make', migrate.make);
gulp.task('migrate:rollback', migrate.rollback);

/**
 * Testing
 */

gulp.task('lint', require('./gulp/lint')(config));

/**
 * Watch tasks
 */

gulp.task('watch', function() {
  gulp.watch(['{api,config,lib,test}/**/*.js', '{gulpfile,index}.js'], ['lint']);
});

gulp.task('watch', ['watch']);

gulp.task('default', function () {
  nodemon({
    script: 'index.js',
    ext: 'js json',
    ignore: ['./node_modules/**']
  }).on('start', 'lint');
});
