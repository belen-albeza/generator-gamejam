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
};

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    var prompts = [{
      name: 'gameName',
      message: 'What\'s the name of your game?',
      default: 'Awesome game'
    }, {
      name: 'githubUsername',
      message: 'What is your Github username',
      default: 'someone',
      store: true
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
    }, {
      name: 'gameSize',
      message: 'Which screen size your game will use?',
      default: '800x600'
    }, {
      type: 'list',
      name: 'deploy',
      message: 'Where do you want to deploy?',
      choices: [
        { name: 'Github pages', value: 'ghpages' },
        { name: 'My own server', value: 'rsync' },
        { name: 'Both', value: 'all' },
        { name: 'Nowhere', value: 'none' }
      ],
      default: 'ghpages',
      store: true
    }];

    this.prompt(prompts, function (props) {
      if (props.githubUsername) {
        this.github = {
          username: props.githubUsername,
          repository: props.githubUsername + '/' + props.repoName,
          repoName: props.repoName
        };
      }
      else {
        this.github = {};
      }

      var size = props.gameSize.split('x');
      var width = size.length === 2 ? parseInt(size[0], 10) : null;
      var height = size.length === 2 ? parseInt(size[1], 10) : null;
      this.gameSize = {
        width: width || 800,
        height: height || 600
      };

      this.gameName = props.gameName;
      this.license = LICENSE_DATA[props.license] || {};
      this.license.key = props.license;
      this.deployTarget = props.deploy;
      this.deployRsync = props.deploy === 'rsync' || props.deploy === 'all';
      this.deployPages = props.deploy === 'ghpages' || props.deploy === 'all';

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      // npm's package.json
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        this
      );
      // index.html
      this.fs.copyTpl(
        this.templatePath('src/_index.html'),
        this.destinationPath('src/index.html'),
        this
      );
      // raw.html
      this.fs.copyTpl(
        this.templatePath('src/_raw.html'),
        this.destinationPath('src/raw.html'),
        this
      );
      // css
      this.fs.copy(
        this.templatePath('src/styles.css'),
        this.destinationPath('src/styles.css')
      );
      // images
      this.fs.copy(
        this.templatePath('src/images/*'),
        this.destinationPath('src/images')
      );
      // js files
      this.fs.copyTpl(
        this.templatePath('src/js/_main.js'),
        this.destinationPath('src/js/main.js'),
        this
      );
      this.fs.copy(
        this.templatePath('src/js/play_scene.js'),
        this.destinationPath('src/js/play_scene.js')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );

      if (this.deployRsync) {
        this.fs.copy(
          this.templatePath('gulp.config.json'),
          this.destinationPath('gulp.config.json')
        );
      }

      this.fs.copyTpl(
        this.templatePath('_gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        this
      );

      this.fs.copyTpl(
        this.templatePath('_README.md'),
        this.destinationPath('README.md'),
        this
      );
    }
  },

  install: function () {
    this.installDependencies({ bower: false });
  }
});
