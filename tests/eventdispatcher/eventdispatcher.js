/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/EventDispatcher/EventDispatcherInterface.js
 * @venus-include ../../src/EventDispatcher/Event.js
 * @venus-include ../../src/EventDispatcher/GenericEvent.js
 * @venus-include ../../src/EventDispatcher/EventSubscriberInterface.js
 * @venus-code ../../src/EventDispatcher/EventDispatcher.js
 */

describe('event dispatcher', function () {
    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    var Subscriber = function () {},
        d;

    Subscriber.prototype = Object.create(Sy.EventDispatcher.EventSubscriberInterface.prototype, {

        getSubscribedEvents: {
            value: function () {
                return {
                    'foo': 'method',
                    'bar': {method: 'method', priority: 1},
                    'baz': [{method: 'method', priority: 255}]
                };
            }
        },

        method: {value: function (event) {
            event.setArgument('context', this);
        }}
    });

    beforeEach(function () {
        d = new Sy.EventDispatcher.EventDispatcher();
    });

    it('should throw if adding invalid listener', function () {
        expect(function () {
            d.addListener('foo', {});
        }).toThrow('A listener must be a function');
    });

    it('should set a listener', function () {
        expect(d.hasListeners('foo')).toBe(false);
        expect(d.addListener('foo', function () {})).toBe(d);
        expect(d.hasListeners('foo')).toBe(true);
    });

    it('should throw if adding invalid subscriber', function () {
        expect(function () {
            d.addSubscriber({});
        }).toThrow('Invalid event subscriber');
    });

    it('should set a subscriber', function () {
        expect(d.hasListeners('foo')).toBe(false);
        expect(d.hasListeners('bar')).toBe(false);
        expect(d.hasListeners('baz')).toBe(false);
        expect(d.addSubscriber(new Subscriber())).toBe(d);
        expect(d.hasListeners('foo')).toBe(true);
        expect(d.hasListeners('bar')).toBe(true);
        expect(d.hasListeners('baz')).toBe(true);
    });

    it('should remove a listener', function () {
        var l = function () {};

        d.addListener('foo', l);
        expect(d.removeListener('foo', l)).toBe(d);
        expect(d.hasListeners('foo')).toBe(false);
    });

    it('should remove a subscriber', function () {
        var s = new Subscriber();

        d.addSubscriber(s);
        expect(d.removeSubscriber(s)).toBe(d);
        expect(d.hasListeners('foo')).toBe(false);
        expect(d.hasListeners('bar')).toBe(false);
        expect(d.hasListeners('baz')).toBe(false);
    });

    it('should return the listeners', function () {
        var a = function () {return 'a'},
            b = function () {return 'b'};

        d.addListener('foo', a, 1);
        d.addListener('foo', b, 255);

        expect(d.getListeners('foo').length).toEqual(2);
    });

    it('should throw if dispatching invalid event', function () {
        expect(function () {
            d.dispatch('foo', {});
        }).toThrow('Invalid event object');
    });

    it('should dispatch an event', function () {
        var dispatched = false;

        d.addListener('foo', function (e) {
            dispatched = true;
            expect(e.getName()).toEqual('foo');
            expect(e.getDispatcher()).toBe(d);
        });
        d.dispatch('foo');
        expect(dispatched).toBe(true);
    });

    it('should dispatch an event with the right context', function () {
        var subscriber = new Subscriber(),
            event;

        d.addSubscriber(subscriber);

        event = new Sy.EventDispatcher.GenericEvent('test');
        d.dispatch('foo', event);
        expect(event.getArgument('context')).toBe(subscriber);

        event = new Sy.EventDispatcher.GenericEvent('test');
        d.dispatch('bar', event);
        expect(event.getArgument('context')).toBe(subscriber);

        event = new Sy.EventDispatcher.GenericEvent('test');
        d.dispatch('baz', event);
        expect(event.getArgument('context')).toBe(subscriber);
    });

    it('should dispatch a custom event', function () {
        var dispatched = false,
            event = new Sy.EventDispatcher.GenericEvent('subject', {foo: 'bar'});

        d.addListener('foo', function (e) {
            dispatched = true;
            expect(e.getArgument('foo')).toEqual('bar');
        });
        d.dispatch('foo', event);
        expect(dispatched).toBe(true);
    });

    it('should stop the event propagation', function () {
        var count = 0;

        d.addListener('foo', function (e) {
            e.stopPropagation();
            count++;
        });
        d.addListener('foo', function () {
            count++;
        });

        d.dispatch('foo');

        expect(count).toEqual(1);
    });

    it('should return the event', function () {
        var dispatched = false;

        expect(d.dispatch('foo') instanceof Sy.EventDispatcher.Event).toBe(true);

        d.addListener('foo', function () {
            dispatched = true;
        });

        expect(d.dispatch('foo') instanceof Sy.EventDispatcher.Event).toBe(true);
        expect(dispatched).toBe(true);
    });
});
