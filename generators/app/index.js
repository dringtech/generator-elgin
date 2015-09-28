'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');

var MyBase = yeoman.generators.Base.extend({});

module.exports = MyBase.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the gnarly ' + chalk.red('Elgin') + ' generator!'
    ));

    var prompts = [
      {
        type    : 'input',
        name    : 'appname',
        message : 'Your project name',
        default : this.appname // Default to current folder name
      }, {
        type    : 'input',
        name    : 'title',
        message : 'Your project title',
        default : 'Superawesome Elgin App'
      }, {
        type    : 'input',
        name    : 'description',
        message : 'A brief description of your project',
        default : 'A project scaffolded with `elgin`'
      }, {
        type    : 'input',
        name    : 'version',
        message : 'What version of this is being created',
        default : '0.0.1'
      }, {
        type    : 'input',
        name    : 'license',
        message : 'What license do you want to publish this under',
        default : 'MIT'
      }
    ];

    this.prompt(prompts, function (props) {
      this.config.set(props);
      this.config.save();
      done();
    }.bind(this));
  },
  configuring: function() {
    this.templateVariables = {
      appname: this.config.get('appname'),
      title: this.config.get('title'),
      description: this.config.get('description'),
      version: this.config.get('version'),
      license: this.config.get('license')
    };
  },
  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this.templateVariables
      );
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        this.templateVariables
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copyTpl(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc'),
        this.templateVariables
      );
    },

    appfiles: function() {
      var self=this;

      var doop = function doop(path) {
        self.fs.copyTpl(
          self.templatePath(path),
          self.destinationPath(path),
          self.templateVariables
        );
      };

      ['bin/app', 'app.js', 'backend/', 'frontend/'].map(doop);
    }
  },

  install: {
    root: function() {
      this.npmInstall(
        [
          "compression@^1.5.2",
          "debug@^2.2.0",
          "express@^4.13.3",
          "morgan@^1.6.1"
        ], { 'save': true });
    },
    backend: function() {
      this.npmInstall(
        [
          "body-parser@^1.14.1",
          "debug@^2.2.0",
          "express@^4.13.3",
          "express-restify-mongoose@^1.0.4",
          "method-override@^2.3.5",
          "mongoose@^4.1.8",
          "mongoose-rest-ready@^0.1.0"
        ], { 'save': true }
      );
    },
    frontend: function() {
      this.npmInstall(
        [
          "express@^4.12.3",
          "nunjucks@^1.3.4"
        ], { 'save': true }
      );
      this.bowerInstall(
        [
          'angular',
          'angular-route',
          'angular-resource',
          'angular-strap',
          'bootstrap'
        ], { 'save': true }
      );
    },
    catchall: function() {
      this.installDependencies();
    }
  }
});
