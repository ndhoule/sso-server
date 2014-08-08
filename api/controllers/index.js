'use strict';

module.exports = require('fs').readdirSync(__dirname)
  .filter(function(filename) {
    return !(/^index.js$/).test(filename);
  })
  .reduce(function(filemap, filename) {
    filemap[filename] = require('./' + filename);
    return filemap;
  }, {});
