'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _ = require('lodash');

var LICENSE_DATA = {
  'MIT': {
    name: 'MIT',
    url: 'http://opensource.org/licenses/MIT'
  },
  'CC-BY-SA-4.0': {
    name: 'Creative Commons Attribution-ShareAlike 4.0',
    url: 'http://creativecommons.org/licenses/by-sa/4.0/'
  },
  'CC-BY-NC-SA-4.0': {
    name: 'Creative Commons Attribution-NonCommercial-ShareAlike',
    url: 'http://creativecommons.org/licenses/by-nc-sa/4.0/'
  },
  'GPL-3': {
    name: 'GPL v3.0',
    url: 'http://www.gnu.org/licenses/lgpl-3.0-standalone.html'
  }
}

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the beautiful' + chalk.red('Gamejam') + ' generator!'
    ));

    var prompts = [{
      name: 'gameName',
      message: 'What\'s the name of your game?',
      default: 'Awesome game'
    }, {
      name: 'githubUsername',
      message: 'What is your Github username',
      default: 'someone'
    }, {
      name: 'repoName',
      message: 'What is this repository name?',
      default: _.last(this.destinationRoot().split(path.sep))
    }, {
      name: 'license',
      message: 'Which license do you want to use',
      type: 'list',
      default: 0,
      choices: ['MIT', 'CC-BY-SA-4.0', 'CC-BY-NC-SA-4.0', 'GPL-3.0']
    }];

    this.prompt(prompts, function (props) {
      if (props.githubUsername) {
        this.github = {
          username: props.githubUsername,
          repository: 'https://github.com/' + props.githubUsername +
            '/' + props.repoName
        };
      }
      else {
        this.github = {};
      }

      this.gameName = props.gameName;
      this.license = LICENSE_DATA[props.license] || {};
      this.license.key = props.license;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this
      );
      this.fs.copyTpl(
        this.templatePath('_index.html'),
        this.destinationPath('index.html'),
        this
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies({
      bower: false,
      npm: true,
      skipInstall: this.options['skip-install']
    });
  }
});