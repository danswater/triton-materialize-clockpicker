'use strict';

var gulp = require( 'gulp' );
var bump = require( 'gulp-bump' );

gulp.task( 'bump-version', function () {
	return gulp.src( [ './bower.json', './package.json' ] )
		.pipe( bump( { 'type' : 'patch' } ) )
		.pipe( gulp.dest( './' ) );
} );

gulp.task( 'js', function () {
	return gulp.src( './src/**/*.js' )
		.pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'css', function () {
	return gulp.src( './src/**/*.css' )
	.pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'build', [ 'js', 'css' ] );
