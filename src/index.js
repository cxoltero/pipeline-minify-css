'use strict';

var concat = require('gulp-concat');
var handyman = require('pipeline-handyman');
var gulpIf = require('gulp-if');
var lazypipe = require('lazypipe');
var minCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

var config = {
  addSourceMaps: true,
  concat: true,
  concatFilename: handyman.getPackageName() + '.min.css',
  plugins:{
    cleanCss: {}
  }
};

module.exports = {
  minifyCSS: function(options) {
    options = options || {};
    config = handyman.mergeConf(config, options);

    return minifyCSS();
  }
};

function minifyCSS() {
  var pipeline = lazypipe()
    .pipe(function() {
      return gulpIf(config.addSourceMaps, sourcemaps.init());
    })
    .pipe(minCSS, config.plugins.cleanCss)
    .pipe(function() {
      return gulpIf(config.concat, concat(config.concatFilename));
    })
    .pipe(function() {
      return gulpIf(config.addSourceMaps, sourcemaps.write('maps'));
    });

  return pipeline();
}
