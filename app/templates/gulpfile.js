// IMPORTANT
// edit gulp.config.json and customize there your deployment settings

'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var rsync = require('gulp-rsync');
var jshint = require('gulp-jshint');

var config = require('./gulp.config.json');

gulp.task('setWatch', function () {
  global.isWatching = true;
});

gulp.task('lint', function () {
  return gulp.src(['gulpfile.js', 'app/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

var browserifyTask = function () {
  var bundler = browserify([
    './app/js/main.js'
  ]);

  var bundle = function ()  {
    return bundler
      .bundle()
      .on('error', gutil.log)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('.tmp/js/'))
      .pipe(connect.reload());
  };

  if (global.isWatching) {
    bundler = watchify(bundler);
    bundler.on('update', bundle);
  }

  return bundle();
};

gulp.task('browserify', function () {
  return browserifyTask();
});

gulp.task('lintedBrowserify', ['lint'], function () {
  return browserifyTask();
});

gulp.task('copyTmp', function () {
  var dir = './node_modules/phaser/build';
  gulp.src(['phaser.min.js', 'phaser.map'], { cwd: dir, base: dir})
    .pipe(gulp.dest('./.tmp/js/'));
});

gulp.task('copy', ['lintedBrowserify', 'copyTmp'], function () {
  gulp.src([
    'index.html', 'styles.css', 'images/**/*', 'fonts/**/*'
  ], { cwd: './app', base: './app' })
  .pipe(gulp.dest('./dist/'));

  gulp.src(['js/phaser.min.js', 'js/bundle.js'], { cwd: '.tmp', base: '.tmp' })
    .pipe(gulp.dest('./dist/'));
});

gulp.task('connect', ['browserify', 'copyTmp'], function () {
  connect.server({
    root: ['app', '.tmp']
  });
});

gulp.task('dist', ['copy']);

gulp.task('deploy', ['dist'], function () {
  return gulp.src('dist')
    .pipe(rsync({
      root: 'dist',
      username: config.deploy.user,
      hostname: config.deploy.host,
      destination: config.deploy.destination,
      recursive: true,
      clean: true,
      progress: true,
      incremental: true
    }));
});

gulp.task('default', ['lint', 'setWatch', 'connect']);
