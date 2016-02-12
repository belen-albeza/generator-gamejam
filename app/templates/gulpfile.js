// IMPORTANT
// edit gulp.config.json and customize there your deployment settings

'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

var browserSync = require('browser-sync').create();
var rsync = require('gulp-rsync');
var del = require('del');

var merge = require('merge-stream');

var config = require('./gulp.config.json');


//
// browserify and js
//

var bundler = browserify([
  './app/js/main.js'
]);

var bundle = function ()  {
  return bundler
    .bundle()
    .on('error', gutil.log)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('.tmp/js/'))
    .pipe(browserSync.stream({once: true}));
};


gulp.task('browserify', bundle);

// 3rd party libs that don't play nice with browserify
gulp.task('libs', function () {
  var dir = './node_modules/phaser/dist/';
  return gulp.src(['phaser.min.js', 'phaser.map'], { cwd: dir, base: dir})
    .pipe(gulp.dest('./.tmp/js/lib/'));
});

gulp.task('js', ['browserify', 'libs']);

//
// build and deploy
//

gulp.task('build', ['js']);

gulp.task('dist', ['build'], function () {
  var rawFiles = gulp.src([
    'index.html', 'raw.html',
    'styles.css',
    'images/**/*', 'fonts/**/*', 'audio/**/*'
  ], { cwd: './app', base: './app' })
    .pipe(gulp.dest('./dist/'));

  var builtFiles = gulp.src(['js/**/*'], { cwd: '.tmp', base: '.tmp' })
    .pipe(gulp.dest('./dist/'));

  return merge(rawFiles, builtFiles);
});

gulp.task('clean', function () {
    return del(['.tmp', 'dist']);
});


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

//
// dev tasks
//

gulp.task('watch', function () {
  bundler = watchify(bundler, watchify.args);
  bundler.on('update', bundle);
});

gulp.task('run', ['watch', 'build'], function () {
  browserSync.init({
    server: ['app', '.tmp']
  });

  gulp.watch('app/**/*.{html,css}').on('change', browserSync.reload);
});

//
// default task
//

gulp.task('default', ['dist']);
