/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-code ../../../src/Storage/Event/LifecycleEvent.js
 */

describe('storage life cycle event', function () {

	it('should return the storage name', function () {
		var evt = new Sy.Storage.Event.LifecycleEvent('foo');

		expect(evt.getStorageName()).toEqual('foo');
	});

	it('should return the store name', function () {
		var evt = new Sy.Storage.Event.LifecycleEvent(null, 'foo');

		expect(evt.getStoreName()).toEqual('foo');
	});

	it('should return the object being manipulated', function () {
		var obj = {some: 'data'},
			evt = new Sy.Storage.Event.LifecycleEvent(null, null, null, obj);

		expect(evt.getData()).toEqual(obj);
	});

});
