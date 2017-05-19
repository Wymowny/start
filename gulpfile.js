'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    babel = require('gulp-babel'),
    sass = require('gulp-sass'),
    del = require('del');

var config = {
    appSource: './source',
    build: './build',

    sassSource: './source/sass/**/*.scss',
    mainScss: './source/sass/main.scss',
    sassDest: './build/css',

    htmlSource: './source/*.html',

    jsSource: './source/js/*.js',
    jsDest: './build/js',

    fontsSource: './source/fonts/**/*',
    fontsDest: './build/fonts',

    imageSource: './source/images/*.+(png|jpg|jpeg|gif|svg)',
    imagesDest: './build/images'
};

gulp.task('watch', function () {
    gulp.watch(config.sassSource, ['sass']);
    gulp.watch(config.htmlSource, ['htmlCopy']);
    gulp.watch(config.jsSource, ['javascript']);
});

gulp.task('sass', function () {
    return gulp.src(config.mainScss).pipe(sass().on('error', function () {
        return sass.logError();
    })).pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.sassDest))
        .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('htmlCopy', function () {
    gulp.src(config.htmlSource)
        .pipe(gulp.dest(config.build))
        .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('javascript', function () {
    return gulp.src(config.jsSource)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('main.js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.jsDest))
        .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('images', function () {
    return gulp.src(config.imageSource)
        .pipe(cache(imagemin({
        interlaced: true
    })))
        .pipe(gulp.dest(config.imagesDest));
});

gulp.task('clean', function () {
    return del(['./build/**']);
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: config.build
        }
    });
});

gulp.task('fonts', function () {
    return gulp.src(config.fontsSource)
        .pipe(gulp.dest(config.fontsDest));
});

gulp.task('default', function (callback) {
    runSequence('clean', ['images', 'sass', 'fonts', 'javascript', 'htmlCopy', 'browserSync', 'watch'], callback);
});