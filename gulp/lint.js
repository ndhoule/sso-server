/* eslint-env node */
'use strict';

var eslint = require('gulp-eslint');
var gulp = require('gulp');
var notify = require('gulp-notify');
var path = require('path');

module.exports = function loadLint() {
  return function runLint() {
    return gulp.src(['{api,config,test,lib}/**/*.js', '{gulpfile,index}.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError())
      .on('error', notify.onError(function(err) {
        return err.plugin + ' failed on ' + path.basename(err.fileName) + ' L' + err.lineNumber;
      }));
  };
};
