const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const sync = require('browser-sync').create();
const concat = require('gulp-concat');
const replace = require('gulp-html-replace');
const uglify = require('gulp-uglify');

// HTML

gulp.task('html:concat', () => {
  return gulp.src('src/*.html')
    .pipe(replace({
      'css': 'css/style.css',
      'js-index': 'js/index.js',
      'js-inner': 'js/inner.js'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('html:clean', () => {
  return gulp.src('dist/*.html')
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('html', gulp.series(
  'html:concat', 'html:clean', () => {
    return gulp.src('dist/*.html')
      .pipe(sync.stream({
        once: true
      }));
  }
));

// CSS

gulp.task('css', () => {
  return gulp.src('src/css/*.css')
    .pipe(postcss([autoprefixer]))
    .pipe(csso())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(sync.stream());
});

gulp.task('js:index', () => {
  return gulp.src('src/js/index.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

// JavaScript

gulp.task('js:inner', () => {
  return gulp.src([
      'src/js/jquery.js',
      'src/js/inner.js'
    ])
    .pipe(uglify())
    .pipe(concat('inner.js'))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('js', gulp.series(
  gulp.parallel(
    'js:index', 'js:inner'
  )
));

// Copy

gulp.task('copy', () => {
  return gulp.src([
      'src/fonts/*',
      'src/images/*',
      'src/pictures/*'
    ], {
      base: 'src',
      encoding: false
    })
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream({
      once: true
    }));
});

// Server

gulp.task('server', () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist'
    }
  });
});

// Watch

gulp.task('watch:html', () => {
    return gulp.watch('src/*.html', gulp.series('html'));
});

gulp.task('watch:css', () => {
    return gulp.watch('src/css/*.css', gulp.series('css'));
});

gulp.task('watch:js', () => {
    return gulp.watch('src/js/*.js', gulp.series('js'));
});

gulp.task('watch:copy', () => {
    return gulp.watch([
      'src/fonts/*',
      'src/images/*',
      'src/pictures/*'
    ], gulp.series('copy'));
});

gulp.task('watch', gulp.parallel(
  'watch:html',
  'watch:css',
  'watch:js',
  'watch:copy'
));

// Build

gulp.task('build', gulp.parallel(
  'html',
  'css',
  'js',
  'copy'
));

// Default

gulp.task('default', gulp.series(
  'build',
  gulp.parallel(
    'watch',
    'server'
  )
));
