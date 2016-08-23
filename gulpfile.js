// Assigning modules to local variables
var gulp = require('gulp');
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * abioka- <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2016-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Default task
gulp.task('default', ['minify-css', 'minify-js', 'copy']);

// Minify CSS
gulp.task('minify-css', function() {
    return gulp.src('core.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist'));
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('core.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function() {
    return gulp.src([
            'icon16.png',
            'icon32.png',
            'icon48.png',
            'icon64.png',
            'icon128.png',
            'loading.gif',
            'manifest.json'
        ])
        .pipe(gulp.dest('dist'))
});
