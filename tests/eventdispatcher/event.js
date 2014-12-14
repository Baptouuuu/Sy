/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/EventDispatcher/EventDispatcherInterface.js
 * @venus-include ../../src/EventDispatcher/EventDispatcher.js
 * @venus-code ../../src/EventDispatcher/Event.js
 */

describe('event dispatcher event', function () {
    var e;

    beforeEach(function () {
        e = new Sy.EventDispatcher.Event();
    })

    it('should say the propagation is stopped', function () {
        expect(e.isPropagationStopped()).toBe(false);
        e.stopPropagation();
        expect(e.isPropagationStopped()).toBe(true);
    });

    it('should throw if setting invalid dispatcher', function () {
        expect(function () {
            e.setDispatcher({});
        }).toThrow('Invalid event dispatcher');
    });

    it('should set the event dispatcher', function () {
        var dispatcher = new Sy.EventDispatcher.EventDispatcher();

        e.setDispatcher(dispatcher);
        expect(e.getDispatcher()).toBe(dispatcher);
    });

    it('should set the event name', function () {
        e.setName('foo');

        expect(e.getName()).toEqual('foo');
    });
});
