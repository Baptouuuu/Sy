/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/EventDispatcher/EventDispatcherInterface.js
 * @venus-include ../../src/EventDispatcher/Event.js
 * @venus-include ../../src/EventDispatcher/GenericEvent.js
 * @venus-include ../../src/EventDispatcher/EventSubscriberInterface.js
 * @venus-include ../../src/EventDispatcher/EventDispatcher.js
 * @venus-code ../../src/EventDispatcher/ImmutableEventDispatcher.js
 */

describe('immutable event dispatcher', function () {
    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    var d;

    beforeEach(function () {
        var ed = new Sy.EventDispatcher.EventDispatcher();

        ed.addListener('foo', function () {});

        d = new Sy.EventDispatcher.ImmutableEventDispatcher(ed);
    });

    it('should throw if constructing with invalid dispatcher', function () {
        expect(function () {
            new Sy.EventDispatcher.ImmutableEventDispatcher({});
        }).toThrow('Invalid event dispatcher');
    });

    it('should throw if adding a listener', function () {
        expect(function () {
            d.addListener('foo', function () {});
        }).toThrow('Unmodifiable event dispatchers must not be modified');
    });

    it('should throw if adding a subscriber', function () {
        expect(function () {
            d.addSubscriber(new Sy.EventDispatcher.EventSubscriberInterface());
        }).toThrow('Unmodifiable event dispatchers must not be modified');
    });

    it('should throw if removing a listener', function () {
        expect(function () {
            d.removeListener('foo', function () {});
        }).toThrow('Unmodifiable event dispatchers must not be modified');
    });

    it('should throw if removing a subscriber', function () {
        expect(function () {
            d.removeSubscriber(new Sy.EventDispatcher.EventSubscriberInterface());
        }).toThrow('Unmodifiable event dispatchers must not be modified');
    });

    it('should dispatch an event', function () {
        expect(d.dispatch('foo') instanceof Sy.EventDispatcher.Event).toBe(true);
    });

    it('should say it has listeners', function () {
        expect(d.hasListeners('foo')).toBe(true);
    });

    it('should return no listeners', function () {
        expect(d.getListeners('foo').length).toEqual(1);
    });
});
