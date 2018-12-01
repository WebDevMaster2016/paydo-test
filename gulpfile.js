'use strict';

// define gulp plugins
const gulp         = require('gulp'),
	  plumber      = require('gulp-plumber'),
	  sass         = require('gulp-sass'),
	  sourcemaps   = require('gulp-sourcemaps'),
	  autoprefixer = require('gulp-autoprefixer'),
	  rename       = require('gulp-rename'),
	  csso         = require('gulp-csso'),
	  svgSprite    = require('gulp-svg-sprites'),
	  rigger       = require('gulp-rigger'),
	  uglify       = require('gulp-uglify'),
	  svgo         = require('gulp-svgo'),
	  imagemin     = require('gulp-imagemin'),
	  connect      = require('gulp-connect'),
	  runSequence  = require('run-sequence');

// define global path for source, destination and watching
const path = {
	dist: {
		html       : '.',
		css        : 'dist/css/',
		js         : 'dist/js/',
		img: {
			images : 'dist/images',
			svg    : 'assets/images/svg',
			sprite : 'dist/images/icons/svg'
		}
	},
	assets: {
		html       : 'assets/html/*.html',
		scss       : 'assets/scss/*.scss',
		js         : 'assets/js/*.js',
		img: {
			images : 'dist/images/**/*',
			svg    : 'assets/images/svg/*.svg'
		}
	},
	watch: {
		html       : 'assets/html/**/*.html',
		scss       : 'assets/scss/**/*.scss',
		js         : 'assets/js/**/*js'
	}
};

const autoprefixerSettings = {
	browsers: [
		'last 2 versions',
		'iOS 7'
	],
	cascade: false
};

//init local server
gulp.task('connect', function () {
	connect.server();
});

// html import plugin
gulp.task('importHtml', function () {
	return gulp.src(path.assets.html)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest(path.dist.html));
});

// compile scss in to css, minify, autoprefixer, rename
gulp.task('scss', function() {
	return gulp.src(path.assets.scss)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(csso({restructure: false}))
		.pipe(autoprefixer(autoprefixerSettings))
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.dist.css));
});


gulp.task('js', function () {
	return gulp.src(path.assets.js)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.dist.js));
});

// minify svg file
gulp.task('svgo', function() {
	return gulp.src(path.assets.img.svg)
		.pipe(svgo({
			plugins: [
				{removeViewBox: false},
				{removeTitle: true}
			]
		}))
		.pipe(gulp.dest(path.dist.img.svg));
});

// make sprite from svg files
gulp.task('sprites', function () {
	return gulp.src(path.assets.img.svg)
		.pipe(svgSprite({
			mode: "symbols",
			preview: false,
			svgId: "custom-icon-%f",
			svg: {
				symbols: "symbol-defs.svg"
			}
		}))
		.pipe(gulp.dest(path.dist.img.sprite));
});

// minify images files
gulp.task('compress-images', function () {
	return gulp.src(path.assets.img.images)
		.pipe(imagemin([
			imagemin.svgo({
				plugins: [
					{removeViewBox: false},
					{cleanupIDs: false},
					{removeTitle: true}
				]
			})
		]))
		.pipe(gulp.dest(path.dist.img.images))
});

// task that run consistently "svgo" and "sprites" tasks
gulp.task('svg-optimize-sprite', function (done) {
	runSequence('svgo', 'sprites', 'compress-images', function () {
		done();
	});
});

// watch any changes in scss, html, javascript files
gulp.task('watch', function() {
	gulp.watch(path.watch.scss, ['scss']);
	gulp.watch(path.watch.html, ['importHtml']);
	gulp.watch(path.watch.js, ['js']);
});

// define default task
gulp.task('default', ['importHtml', 'scss', 'js', 'connect', 'watch']);