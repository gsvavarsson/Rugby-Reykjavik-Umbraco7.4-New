var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// Basic Gulp task syntax
gulp.task('hello', function() {
	console.log('Hello Zell!');
})

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		}
	})
})

gulp.task('sass', function() {
	return gulp.src('sass/rustikus/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
		.pipe(sass()) // Passes it through a gulp-sass
		.on('error', swallowError)
		.pipe(gulp.dest('css/rustikus')) // Outputs it in the css folder
		.pipe(browserSync.reload({ // Reloading with Browser Sync
			stream: true
		}));
})

gulp.task('compile-scripts', function () {
	var files = [];

	files.push('scripts/libs/**/*.js');
	files.push('scripts/src/**/*.js');

	return gulp.src(files)
		.pipe(concat('app.js'))
		.pipe(gulp.dest('scripts/app/'));
})

// Watchers
gulp.task('watch', function() {
	gulp.watch('sass/rustikus/**/*.scss', ['sass']);
	gulp.watch('Views/*.cshtml', browserSync.reload);
	gulp.watch('scripts/libs/**/*.js', ['compile-scripts']);
	gulp.watch('scripts/src/**/*.js', ['compile-scripts']);
})

// Swallow Errors
function swallowError (error) {

	// If you want details of the error in the console
	console.log(error.toString())

	this.emit('end')
}

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {

	return gulp.src('views/*.cshtml')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('dist'));
});

// Optimizing Images 
//gulp.task('images', function() {
//	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
//		// Caching images that ran through imagemin
//		.pipe(cache(imagemin({
//			interlaced: true,
//		})))
//		.pipe(gulp.dest('dist/images'))
//});

// Copying fonts 
gulp.task('fonts', function() {
	return gulp.src('fonts/**/*')
		.pipe(gulp.dest('fonts/fonts/'))
})

// Cleaning 
gulp.task('clean', function() {
	return del.sync('dist').then(function(cb) {
		return cache.clearAll(cb);
	});
})

gulp.task('clean:dist', function() {
	return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
	runSequence(['sass', 'browserSync', 'watch'],
		callback
	)
})

gulp.task('build', function(callback) {
	runSequence(
		'clean:dist',
		'sass',
		['useref', 'images', 'fonts'],
		callback
	)
})