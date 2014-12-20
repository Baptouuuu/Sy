/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/EventDispatcher/EventDispatcherInterface.js
 * @venus-include ../../src/EventDispatcher/EventDispatcher.js
 * @venus-include ../../src/EventDispatcher/Event.js
 * @venus-code ../../src/EventDispatcher/GenericEvent.js
 */

describe('event dispatcher generic event', function () {
    var e;

    beforeEach(function () {
        e = new Sy.EventDispatcher.GenericEvent();
    })

    it('should extend base event', function () {
        expect(e instanceof Sy.EventDispatcher.Event).toBe(true);
    });

    it('should throw if setting invalid args object', function () {
        expect(function () {
            new Sy.EventDispatcher.GenericEvent('foo', '');
        }).toThrow('Event arguments must be an object');

        expect(function () {
            e.setArguments('');
        }).toThrow('Event arguments must be an object');
    });

    it('should return the subject', function () {
        var e = new Sy.EventDispatcher.GenericEvent('foo');

        expect(e.getSubject()).toEqual('foo');
    });

    it('should return an argument', function () {
        var e = new Sy.EventDispatcher.GenericEvent('foo', {foo: 'bar'})

        expect(e.getArgument('foo')).toEqual('bar');
    });

    it('should set an argument', function () {
        expect(e.setArgument('foo', 'bar')).toBe(e);
        expect(e.getArgument('foo')).toEqual('bar');
    });

    it('should get arguments', function () {
        var data = {foo: 'bar'};
        expect(e.setArguments(data)).toBe(e);
        expect(e.getArguments()).toBe(data);
    });
});
