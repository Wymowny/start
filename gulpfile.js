'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    cache = require('gulp-cache'),
    runSequence = require('run-sequence'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css');

var config = {
    mainScss: './source/sass/main.scss',
    sassSource: './source/sass/**/*.scss',
    htmlSource: './source/*.html',
    jsSource: './source/app/js/**/*.js',
    sassDest: './build/css',
    appSource: './source',
    build: './build'
};

gulp.task('sass', () => {
    return gulp.src(config.mainScss)
        .pipe(sass().on('error', () => sass.logError()))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.sassDest))
        .pipe(browserSync.reload({
        stream: true
        }))
});

gulp.task('watch', () => {
    gulp.watch(config.sassSource, ['sass']);
    gulp.watch(config.htmlSource, browserSync.reload);
    gulp.watch(config.jsSource, browserSync.reload);
});

gulp.task('htmlCopy', () => {
    gulp.src('./source/*.html')
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('javascript', () => {
    return gulp.src('source/js/*.js')
        .pipe(concat('main.js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('images', () => {
    return gulp.src('source/images/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('build/images'))
});

gulp.task('clean', () => {
    return del([
        'build/**',
    ]);
});

gulp.task('browserSync', () => {
    browserSync.init({
        server: {
            baseDir: config.build
        }
    })
});

gulp.task('fonts', () => {
    return gulp.src('source/fonts/**/*')
        .pipe(gulp.dest('build/fonts'))
});

gulp.task('default', (callback) => {
    runSequence('clean',
        ['images', 'sass', 'fonts', 'javascript', 'htmlCopy', 'browserSync', 'watch'],
        callback
    )
});