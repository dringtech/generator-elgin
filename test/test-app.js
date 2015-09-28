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
      'bin/app',
      'app.js'
    ]);
  });

  it('creates frontend files', function() {
    assert.file(['frontend/index.js']);
  });

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
  });

  it.skip('installs and saves common packages', function() {
    ['compression', 'debug', 'express', 'morgan'].map(function(library) {
      var libPattern = new RegExp('"'+library+'"');
      assert.fileContent('package.json', libPattern);
    });
  });
});
