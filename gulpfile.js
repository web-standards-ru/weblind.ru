const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const gulp = require('gulp');
const htmlmin = require('gulp-html-minify');
const postcss = require('gulp-postcss');
const sync = require('browser-sync').create();
const concat = require('gulp-concat');
const useref = require('gulp-useref');
const minify = require('gulp-minify');

gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(htmlmin())
    .pipe(gulp.dest('dest'))
    .pipe(sync.stream());
});

gulp.task('css', () => {
  return gulp.src('src/css/*.css')
    .pipe(postcss([autoprefixer]))
    .pipe(csso())
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('dest/css'))
    .pipe(sync.stream());
});

gulp.task('index-js', () => {
  return gulp.src('src/js/index.js')
    .pipe(minify({
      ext: {
        min: '.min.js'
      },
      noSource: true
    }))
    .pipe(gulp.dest('dest/js'))
});

gulp.task('inner-js', () => {
  return gulp.src(['src/js/jquery-1.8.2.min.js', 'src/js/inner.js'])
    .pipe(minify({
      ext: {
        min: '.js'
      },
      noSource: true
    }))
    .pipe(concat('inner.min.js'))
    .pipe(gulp.dest('dest/js'))
});

gulp.task('js', ['index-js', 'inner-js']);

gulp.task('copy', () => {
  return gulp.src([
      'src/fonts/*',
      'src/images/*',
      'src/js/*'
    ], {base: 'src'})
    .pipe(gulp.dest('dest'))
    .pipe(sync.stream({
      once: true
    }));
});

gulp.task('server', () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dest'
    }
  });
});

gulp.task('watch', ['server'], () => {
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/css/*.css', ['css']);
  gulp.watch('src/js/*.js', ['js'])
  gulp.watch([
    'src/fonts/*',
    'src/images/*'
  ], ['copy']);
});

gulp.task('default', [
  'html',
  'css',
  'js',
  'copy',
  'watch'
]);
