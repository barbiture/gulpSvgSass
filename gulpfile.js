// gulp browser-sync gulp-rigger gulp-watch gulp-sass gulp-imagemin gulp-autoprefixer gulp-cssmin gulp-plumber imagemin-pngquant imagemin-pngquant gulp-jsmin gulp-rename gulp-sourcemaps gulp-svgstore gulp-svgmin gulp-inject

'use strict';
var gulp           = require('gulp'),
    browserSync    = require('browser-sync').create(),
    rigger         = require('gulp-rigger'),
    watch          = require('gulp-watch'),
    sass           = require('gulp-sass'),
    imagemin       = require('gulp-imagemin'),
    autoprefixer   = require('gulp-autoprefixer'),
    cssmin         = require('gulp-cssmin'),
    plumber        = require('gulp-plumber'),
    pngquant       = require('imagemin-pngquant'),
    jsmin          = require('gulp-jsmin'),
    rename         = require('gulp-rename'),
    sourcemaps     = require('gulp-sourcemaps'),
    svgstore       = require('gulp-svgstore'),
    svgmin         = require('gulp-svgmin'),
    inject         = require('gulp-inject');

gulp.task('icons', function () {
    var svgs = gulp
        .src('./src/assets/sprites/sprites/*.svg')
        .pipe(svgmin())
        .pipe(svgstore({ inlineSvg: true }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    return gulp
        .src('./src/assets/sprites/sprites/')
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(gulp.dest('./src/assets/sprites/sprites/'));
});
//HTML
gulp.task('html', function(){
  gulp.src('./src/*.html')
    .pipe(rigger())
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});


// Sass
gulp.task('sass', function () {
  return gulp.src('./src/assets/sass/styles.scss')
  .pipe(sourcemaps.init())
  .pipe (sass().on('error', sass.logError))
  .pipe(sourcemaps.write('maps'))
  .pipe (gulp.dest('./build/stylesheets'));
});
// css
gulp.task('cssmin', function () {
    return gulp.src('build/stylesheets/styles.css')
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/stylesheets'))
});

// js
gulp.task('js', function(){
  gulp.src('./src/assets/js/scripts.js')
    .pipe(sourcemaps.init())
    .pipe(rigger())
    .pipe(plumber())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});
gulp.task('jsmin', function(){
  gulp.src('./build/js/scripts.js')
    .pipe(rigger())
    .pipe(plumber())
    .pipe(jsmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/js'))
});
// fonts
gulp.task('fonts', function(){
  gulp.src('./src/assets/fonts/**/*.*')
  .pipe(gulp.dest('./build/fonts/'))
  .pipe(browserSync.stream());
});
// IMG
gulp.task('img', function(){
  gulp.src('./src/assets/img/**/*')
  .pipe(gulp.dest('./build/images/'))
  .pipe(imagemin())
  .pipe(browserSync.stream());
});

//+----------------------------------------------------------------+//

gulp.task('build', ['icons', 'html', 'sass', 'img', 'js', 'fonts']);
gulp.task('buildMin', ['jsmin', 'cssmin']);

gulp.task('default', ['build', 'watch', 'serve']);

gulp.task('serve', ['watch'], function (){
  browserSync.init({
    server: {
      baseDir: "./build"
    },
    host: "localhost",
    port: 8080,
    tunnel: false,
    directory: true,
    browser: "/Applications/Google\ Chrome.app/"
  });
});

//+----------------------------------------------------------------+//

gulp.task('watch', function(){
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.js', ['js']);
  gulp.watch('./src/assets/img/**/*.*', ['img']);
  gulp.watch('./src/assets/fonts/**/*.*', ['fonts']);
});