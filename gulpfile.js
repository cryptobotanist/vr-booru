// load the plugins
var gulp      = require('gulp');
var less      = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var nodemon = require('gulp-nodemon')
var rename    = require('gulp-rename');

// define a task called css
gulp.task('css', function() {
	// grab the less file, process the LESS, save to style.css
	return gulp.src('public/assets/css/style.less')
		.pipe(less())
		.pipe(minifyCSS())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('public/assets/css'));
});

gulp.task('export_libs', function(){
	// grab the required libraries from node_modules and export them to assets/libs
	return gulp.src([
		'node_modules/angular/*.js', 'node_modules/angular-animate/*.min.js',
		'node_modules/angular-route/*.min.js', 'node_modules/animate.css/*.min.css',
		'node_modules/bootstrap/dist/js/*.min.js', 'node_modules/bootstrap/dist/css/*.min.css',
		'node_modules/font-awesome/css/*.min.css'
	])
	.pipe(gulp.dest('public/assets/libs'))
});

gulp.task('export_fonts', function(){
	return gulp.src(['node_modules/font-awesome/fonts/*.woff'])
	.pipe(gulp.dest('public/assets/fonts'))
})

gulp.task('start', function () {
  nodemon({
    script: 'server.js',
		watch: ['public/app/**/*.*', 'server.js', 'app/**/*.*', 'public/assets/css/style.less'],
		ext: 'js html less',
		tasks: ['css', 'export_fonts', 'export_libs'],
		env: { 'NODE_ENV': 'development' }
  })
});
