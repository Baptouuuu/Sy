namespace('Sy.View.Event');

/**
 * Event fired before and after a viewscreen is displayed in the viewport
 *
 * @package Sy
 * @subpackage View.Event
 * @class 
 */

Sy.View.Event.ViewPortEvent = function (viewscreen) {
	if (!(viewscreen instanceof Sy.View.ViewScreen)) {
		throw new TypeError('Invalid viewscreen');
	}

	this.viewscreen = viewscreen;
};
Sy.View.Event.ViewPortEvent.prototype = Object.create(Object.prototype, {

	PRE_DISPLAY: {
		value: 'view::on::pre::display',
		writable: false
	},

	POST_DISPLAY: {
		value: 'view::on::post::display',
		writable: false
	},

	/**
	 * Return the viewscreen being displayed
	 *
	 * @return {Sy.View.ViewScreen} 
	 */
	
	getViewScreen: {
		value: function () {
			return this.viewscreen;
		}
	}

});
