'use strict';

var gulp = require( 'gulp' );

gulp.task( 'js', function () {
	return gulp.src( './src/**/*.js' )
		.pipe( gulp.dest( './dist' ) );
} );

gulp.task( 'build', [ 'js' ] );
