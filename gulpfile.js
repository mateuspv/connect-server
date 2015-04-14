var gulp = require('gulp');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');

var Opts = {
  lint: {
    src: ['./api/**/*.js']
  },
  test: {
    src: ['./test/**/*.js']
  }
};

gulp.task('check', ['lint', 'test'], function () {
});

gulp.task('lint', function () {
  var src = Opts.lint.src;

  gulp.src(src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
});

gulp.task('test', function () {
  var src = Opts.test.src;
  var options = {
    recursive: true,
    reporter: 'nyan',
    ui: 'tdd'
  };

  gulp.src(src)
    .pipe(mocha(options));
});
