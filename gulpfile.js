var gulp = require('gulp'),
    gutil = require('gulp-util'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    uncss = require('gulp-uncss'),
    minifyCss = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin');


gulp.task('copy', function () {
    gulp.src(['favicon.ico', 'pifm-browser.js', 'config.json', 'package.json'])
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-server-lib', function () {
    gulp.src('lib/*.js')
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('copy-pifm', function () {
    gulp.src('lib/pifm')
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('html', function () {
    var assets = useref.assets();

    return gulp.src('index.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('dist'));
});

gulp.task('css', ['html'], function () {
    return gulp.src('vendor/css/*.css')
        .pipe(concat('styles.css'))
        .pipe(uncss({
            html: ['index.html']
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9']
        }))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/vendor/css'));
});

gulp.task('default', ['css', 'copy-server-lib', 'copy-pifm', 'copy']);
