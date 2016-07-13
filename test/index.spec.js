'use strict';

var assert = require('stream-assert');
var expect = require('chai').expect;
var gulp = require('gulp');
var handyman = require('pipeline-handyman');
var minifyPipeline = require('../src/index.js');
var path = require('path');

function getFixtures(glob) {
  return path.join(__dirname, 'fixtures', glob);
}

describe('pipeline-minify-css', function() {

  describe('Default Configuration', function() {
    it('Should output two files after concatenation; Minified file and sourcemap', function (done) {

      gulp
        .src(getFixtures('*'))
        .pipe(minifyPipeline.minifyCSS())
        .pipe(assert.length(2))
        .pipe(assert.first(function (file) {
          var path = handyman.getPackageName() + '.min.css.map';
          
          expect(file.relative.toString()).to.equal(path);
        }))
        .pipe(assert.last(function (file) {
          expect(file.relative.toString()).to.equal(handyman.getPackageName() + '.min.css');
        }))
        .pipe(assert.end(done));
    });
  });

  describe('User specific configurations', function() {
    it('Should generate only the minified file', function (done) {
      gulp
        .src(getFixtures('*'))
        .pipe(minifyPipeline.minifyCSS({addSourceMaps: false, concat: true}))
        .pipe(assert.length(1))
        .pipe(assert.end(done));
    });

    it('Should output the same number of files minified', function (done) {
      gulp
        .src(getFixtures('*'))
        .pipe(minifyPipeline.minifyCSS({addSourceMaps: false, concat: false}))
        .pipe(assert.length(2))
        .pipe(assert.end(done));
    });

    it('Should output the same number of files minified and the map for each one', function (done) {
      gulp
        .src(getFixtures('*'))
        .pipe(minifyPipeline.minifyCSS({addSourceMaps: true, concat: false}))
        .pipe(assert.length(4))
        .pipe(assert.end(done));
    });

    it('Should output custom min and map files', function (done) {
      var customFilename = 'test/filename.css';

      gulp
        .src(getFixtures('*'))
        .pipe(minifyPipeline.minifyCSS({
          addSourceMaps: true,
          concat: true,
          concatFilename: customFilename
        }))
        .pipe(assert.length(2))
        .pipe(assert.first(function (file) {
          var path = customFilename + '.map';
          
          expect(file.relative.toString()).to.equal(path);
        }))
        .pipe(assert.last(function (file) {
          expect(file.relative.toString()).to.equal(customFilename);
        }))
        .pipe(assert.end(done));
    });
  });

});