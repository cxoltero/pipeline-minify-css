'use strict';

var del = require('del');
var gulp = require('gulp');
var minifyCssPipeline = require('./src/index.js');
var testPipeline = require('pipeline-test-node')();
var validatePipeline = require('pipeline-validate-js')();

var config = {
  cssFiles: [
    'test/**/*.css'
  ],

  jsFiles: [
    '*.js',
    'src/**/*.js',
    'test/**/*.js'
  ]
};

gulp.task('clean', function () {
  return del.sync([
    './dest/**'
  ]);
});

gulp.task('validate', function() {
  return gulp
    .src(config.jsFiles)
    .pipe(validatePipeline.validateJS())
    .pipe(testPipeline.test());
});

gulp.task('build', ['clean', 'validate'] , function() {

  return gulp
    .src(config.cssFiles)
    .pipe(minifyCssPipeline.minifyCSS())
    .pipe(gulp.dest('dest/'));
});