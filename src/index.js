'use strict';

var concat = require('gulp-concat');
var handyman = require('pipeline-handyman');
var gulpIf = require('gulp-if');
var lazypipe = require('lazypipe');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var cleanCss = require('gulp-clean-css');

var config = {
  addSourceMaps: true,
  concat: true,
  concatFilename: handyman.getPackageName() + '.min.css',
  plugins: {
    cleanCss: {}
  }
};

module.exports = {
  minifyCSS: function(options) {
    options = options || {};
    config = handyman.mergeConfig(config, options);

    return pipelineFactory();
  }
};

function pipelineFactory() {
  var pipeline = lazypipe()

    .pipe(function() {
      return gulpIf(config.addSourceMaps, sourcemaps.init());
    })
    .pipe(cleanCss, config.plugins.cleanCss)
    .pipe(function () {
      return gulpIf(!config.concat, rename({extname: '.min.css'}));
    })
    .pipe(function() {
      return gulpIf(config.concat, concat(config.concatFilename));
    })
    .pipe(function() {
      return gulpIf(config.addSourceMaps, sourcemaps.write('.'));
    });

  return pipeline();
}
