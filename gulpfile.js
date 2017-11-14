const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const sync = require('browser-sync').create();
const concat = require('gulp-concat');
const useref = require('gulp-useref');

gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
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
  gulp.watch([
    'src/fonts/*',
    'src/images/*',
    'src/js/*'
  ], ['copy']);
});

gulp.task('default', [
  'html',
  'css',
  'copy',
  'watch'
]);
