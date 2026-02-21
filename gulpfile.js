/* eslint-disable */
const gulp = require('gulp');
const path = require('path');

function copyIcons() {
    return gulp.src('nodes/**/*.{png,svg}')
        .pipe(gulp.dest('dist/nodes'));
}

exports['build:icons'] = copyIcons;
