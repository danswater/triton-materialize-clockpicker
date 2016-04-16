;( function () {
	'use strict';

	function mClockpicker ( mClockpickerDefaultOptions, moment ) {

		function link ( scope, element, attr, ngModel ) {
			var options = angular.extend( {}, mClockpickerDefaultOptions, scope.$eval( attr.mClockpickerOptions ) );
			
			var formatTime = options.twelvehour ? 'hh:mm A' : 'HH:mm';
			
			if ( options.twelvehour ) {
				formatTime = 'hh:mm A';
			} else {
				formatTime = 'HH:mm';
			}

			console.log( ngModel.$modelValue );

			element.pickatime( options );

			function getModelValue () {
				return ngModel.$modelValue ? ngModel.$modelValue.clone() : moment();
			}

			function render ( val ) {
        		element.val( ngModel.$viewValue || '' );
      		};

			scope.$watch( function () {
				return ngModel.$modelValue && ngModel.$modelValue.unix && ngModel.$modelValue.unix();
			}, function () {
				var test =  ngModel.$formatters.reduceRight( function ( prev, formatter ) {
					return formatter( prev );
				}, ngModel.$modelValue );
				console.log( 'WATCH', test );
				render();
			} );

			ngModel.$parsers.push( function ( val ) {
				console.log( 'PARSERS', val );
				var time = val;
				ngModel.$setValidity( 'badFormat', Boolean( time ) );

				if ( !time ) {
					return getModelValue();
				}

				// sync to two way binding
				var inUtc   = getModelValue().isUTC();
				var newDate = moment( getModelValue() );
				newDate     = newDate.local();
				newDate.hour( time.hour );
				newDate.minute( time.minute );
				newDate.second( 0 );

				if ( inUtc ) {
					return newDate.utc;
				}

				return newDate;

			} );

			ngModel.$formatters.push( function ( momentDate ) {
				// var val = parseViewValue( ngModel.$viewValue );
				console.log( '$formatters', ngModel.$viewValue );
				var val = ngModel.$viewValue;

				if ( !momentDate ) {
					return '';
				}

				var localMomentDate = momentDate.clone().local();
				
				var isSameTime = !val || (val.hour === localMomentDate.hour() && val.minute === localMomentDate.minute());

				if ( element.is( ':focus' ) && isSameTime ) {
					return ngModel.$viewValue;
				}

				return localMomentDate.format( formatTime );

			} );
		}

		return {
			'restrict' : 'A',
			'require' : 'ngModel',
			'link' : link
		};
	}

	mClockpicker.$inject = [ 'mClockpickerDefaultOptions', 'moment' ];

	angular.module( 'angular.materialize.clockpicker', [
		'angularMoment'
	] )
	.directive( 'mClockpicker', mClockpicker )
	.value( 'mClockpickerDefaultOptions', {
		'twelvehour' : true,
		'autoclose' : false,
		'donetext' : 'ok'
	} );
} )();