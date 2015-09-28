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

  writing: {
    app: function () {
      var templateVars = {
        appname: this.config.get('appname'),
        description: this.config.get('description'),
        version: this.config.get('version'),
        license: this.config.get('license')
      };
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        templateVars
      );
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        templateVars
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
    },

    appfiles: function() {
      var self=this;

      var doop = function doop(path) {
        self.fs.copy(self.templatePath(path), self.destinationPath(path));
      };

      ['bin/app', 'app.js'].map(doop);
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
        ], { 'saveDev': true });
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
        ]
      )
    },
    catchall: function() {
      this.installDependencies();
    }
  }
});
