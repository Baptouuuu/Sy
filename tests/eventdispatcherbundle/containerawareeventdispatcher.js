/**
 * @venus-library jasmine
 * @venus-include ../../vendor/Reflection.js/reflection.min.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/PropertyAccessor.js
 * @venus-include ../../src/EventDispatcher/EventDispatcherInterface.js
 * @venus-include ../../src/EventDispatcher/EventDispatcher.js
 * @venus-include ../../src/EventDispatcher/EventSubscriberInterface.js
 * @venus-include ../../src/EventDispatcher/Event.js
 * @venus-include ../../src/ServiceContainer/Core.js
 * @venus-include ../../src/ServiceContainer/Definition.js
 * @venus-include ../../src/ServiceContainer/Alias.js
 * @venus-code ../../src/EventDispatcherBundle/ContainerAwareEventDispatcher.js
 */

describe('container aware event dispatcher', function () {
    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    var Subscriber = function () {},
        dispatched,
        d;

    Subscriber.prototype = Object.create(Sy.EventDispatcher.EventSubscriberInterface.prototype, {
        getSubscribedEvents: {
            value: function () {
                return {
                    'foo': 'method',
                    'bar': {method: 'method', priority: 1},
                    'baz': [{method: 'method', priority: 255}],
                }
            }
        }
    });

    window.Foo = function () {
        this.handle = function () {
            dispatched = true;
        };
    };

    beforeEach(function () {
        d = new Sy.EventDispatcherBundle.ContainerAwareEventDispatcher();
        d.setServiceContainer(new Sy.ServiceContainer.Core());
        dispatched = false;
    });

    it('should throw if contructing with invalid container', function () {
        expect(function () {
            (new Sy.EventDispatcherBundle.ContainerAwareEventDispatcher()).setServiceContainer({});
        }).toThrow('Invalid service container');
    });

    it('should add a service as listener', function () {
        expect(d.hasListeners('foo')).toBe(false);
        expect(d.addListenerService('foo', 'service', 'method')).toBe(d);
        expect(d.hasListeners('foo')).toBe(true);
    });

    it('should add a service as subscriber', function () {
        expect(d.hasListeners('foo')).toBe(false);
        expect(d.hasListeners('bar')).toBe(false);
        expect(d.hasListeners('baz')).toBe(false);
        expect(d.addSubscriberService('service', Subscriber)).toBe(d);
        expect(d.hasListeners('foo')).toBe(true);
        expect(d.hasListeners('bar')).toBe(true);
        expect(d.hasListeners('baz')).toBe(true);
    });

    it('should throw if adding invalid subscriber service contructor', function () {
        expect(function () {
            d.addSubscriberService('service', null);
        }).toThrow('Invalid subscriber service constructor');
    });

    it('should return the container', function () {
        expect(d.getContainer() instanceof Sy.ServiceContainer.Core).toBe(true);
    });

    it('should return listeners', function () {
        d.getContainer().set({
            service: {
                constructor: 'Foo'
            }
        });

        d.addListenerService('foo', 'service', 'handle');

        expect(d.dispatch('foo') instanceof Sy.EventDispatcher.Event).toBe(true);
        expect(dispatched).toBe(true);
    });
});
