'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var fs = require('fs');

var appConfig = {
  appname: 'elgin-test',
  version: '1.0.2',
  description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
}

describe('elgin:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true })
      .withPrompts(appConfig)
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'bower.json',
      'package.json',
      '.editorconfig',
      '.jshintrc',
      '.bowerrc',
      'bin/app',
      'app.js'
    ]);
  });

  it('creates frontend files', function() {
    assert.file([
      'frontend/index.js',
      'frontend/public/css/main.css',
      'frontend/public/js/main.js',
      'frontend/public/partials/main.html',
      'frontend/public/partials/about.html',
      'frontend/views/base.html',
      'frontend/views/main.html'
    ]);
  });

  it('customises frontend view files', function() {
    var namePattern = new RegExp('ng-app="'+appConfig.appname+'App"');
    assert.fileContent('frontend/views/main.html', namePattern);
    var titlePattern = new RegExp('{% set page_title = '+appConfig.title+' %}')
    assert.fileContent('frontend/views/main.html', namePattern);
  })

  it('customises the angular app', function() {
    var appPattern = new RegExp('var '+appConfig.appname+'App = angular.module\\(\''+appConfig.appname+'App\'');
    assert.fileContent('frontend/public/js/main.js', appPattern);
  })

  it('creates backend files', function() {
    assert.file(['backend/index.js']);
  });

  it('customises package.json file', function() {
    var namePattern = new RegExp('"name"\\s*:\\s*"'+appConfig.appname+'"')
    assert.fileContent('package.json', namePattern);
    var versionPattern = new RegExp('"version"\\s*:\\s*"'+appConfig.version+'"')
    assert.fileContent('package.json', versionPattern);
  });

  it.skip('creates an executable startup script', function () {
    assert(fs.accessSync('bin/app', fs.X_OK),'bin/app not executable');
    var messagePattern = new RegExp('debug(.*?'+appConfig.appname+' App listening at http://')
    debug('<%= appname %> App listening at http://%s:%s', host, port);
  });

  it.skip('installs and saves common packages', function() {
    ['compression', 'debug', 'express', 'morgan'].map(function(library) {
      var libPattern = new RegExp('"'+library+'"');
      assert.fileContent('package.json', libPattern);
    });
  });
});
