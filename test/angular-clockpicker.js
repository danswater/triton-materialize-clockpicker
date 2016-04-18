'use strict';

/* global chai: false */
/* global sinon: false */

var expect = chai.expect;

describe( 'The angular-clockpicker module', function () {
	var self;

	beforeEach( function () {
		angular.mock.module( 'triton.materialize.clockpicker' );
		self = this;
	} );

	describe( 'tm-clockpicker directive', function () {
		beforeEach( function () {
			this.directiveElement = {};

			angular.mock.module( function ( $provide ) {
				$provide.decorator( 'tmClockpickerDirective', function ( $delegate ) {
					var directive = $delegate[ 0 ];

					directive.compile = function () {
						return function () {
							self.directiveElement = arguments[ 1 ] = angular.extend( Object.create( arguments[ 1 ] ), self.directiveElement, arguments[ 1 ] );
							return directive.link.apply( this, arguments );
						};
					};

					return $delegate;
				} );
			} );
		} );

		beforeEach( angular.mock.inject( function ( $compile, $rootScope, moment, tmClockpickerDefaultOptions, tmClockpickerFactory ) {
			this.$compile                     = $compile;
			this.$rootScope                   = $rootScope;
			this.$scope                       = this.$rootScope.$new();
			this.$scope.date                  = moment( '1935-10-31 00:00' );
			this.clockpickerDefaultOptions    = tmClockpickerDefaultOptions;
			this.options                      = {};
			this.moment                       = moment;
			this.directiveElement.pickatime = sinon.spy();
			this.clockpickerService           = tmClockpickerFactory;

			this.initDirective = function () {
				var html = '<form name="form"><input ng-model="date" name="date" tm-clockpicker tm-clockpicker-options=\'' + JSON.stringify( this.options ) + '\'/></form>';

				this.formElement = this.$compile( html )( this.$scope );
				this.$scope.$digest();
				this.dateNgModel = this.$scope.form.date;
			};

			this.initDirective();
		} ) );

		it( 'should not make field read-only one non mobile device', function () {
			this.directiveElement.addClass = sinon.spy();
			this.directiveElement.attr     = sinon.spy();
			this.initDirective();
			expect( this.directiveElement.addClass ).to.not.have.been.called; // eslint-disable-line no-unused-expressions
			expect( this.directiveElement.attr ).to.not.have.been.called; // eslint-disable-line no-unused-expressions
		} );

		it( 'should call clockpicker with default options if any are provided', function () {
			expect( this.directiveElement.pickatime ).to.have.been.calledWith( this.clockpickerDefaultOptions );
		} );

		it( 'should merge given options with default options', function () {
			this.options = {
				'twelvehour' : false,
				'autoclose'  : true
			};

			this.initDirective();
			expect( this.directiveElement.pickatime ).to.have.been.calledWith( {
				'twelvehour' : false,
				'autoclose'  : true,
				'donetext'   : 'ok'
			} );
		} );

		it( 'should not change date of ng-model input', function () {
			[ 'bad input', '12:00 PM' ].forEach( function ( input ) {
				this.dateNgModel.$setViewValue( input );
				expect( this.$scope.date.format( 'YYYY-MM-DD' ) ).to.equal( '1935-10-31' );
			}, this );
		} );
	} );

	describe( 'the formatting of time', function () {
		it( 'should not reformat time while input is focused if time is the same', function () {
			var isSpy    = this.directiveElement.is = sinon.stub().returns( true );
			var userTime = '1:1pm';

			this.dateNgModel.$setViewValue( userTime );

			expect( this.dateNgModel.$formatters[ 1 ]( this.dateNgModel.$modelValue ) ).to.equal( userTime );
			expect( isSpy ).to.have.been.calledWith( ':focus' );
		} );

		it( 'should not reformat time while input is focused if value is not valid', function () {
			var isSpy    = this.directiveElement.is = sinon.stub().returns( true );
			var userTime = 'invalid';

			this.dateNgModel.$setViewValue( userTime );

			expect( this.dateNgModel.$formatters[ 1 ]( this.dateNgModel.$modelValue ) ).to.equal( userTime );
			expect( isSpy ).to.have.been.calledWith( ':focus' );
		} );
	} );
} );
