/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/View/NodeWrapper.js
 * @venus-include ../../../src/View/ViewScreen.js
 * @venus-code ../../../src/View/Event/ViewPortEvent.js
 */

describe('viewport event', function () {

	it('should throw an error if invalid viewscreen', function () {
		expect(function () {
			new Sy.View.Event.ViewPortEvent('');
		}).toThrow('Invalid viewscreen');
	});

	it('should return the viewscreen being displayed', function () {
		var viewscreen = new Sy.View.ViewScreen(),
			event = new Sy.View.Event.ViewPortEvent(viewscreen);

		expect(event.getViewScreen()).toEqual(viewscreen);
	});

});
