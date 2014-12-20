/**
 * @venus-library jasmine
 * @venus-include ../../../vendor/Reflection.js/reflection.min.js
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/PropertyAccessor.js
 * @venus-include ../../../src/ServiceContainer/Core.js
 * @venus-include ../../../src/ServiceContainer/CompilerPassInterface.js
 * @venus-include ../../../src/ServiceContainer/Definition.js
 * @venus-include ../../../src/ServiceContainer/Alias.js
 * @venus-include ../../../src/ServiceContainer/Reference.js
 * @venus-include ../../../src/ServiceContainer/Parameter.js
 * @venus-include ../../../src/ServiceContainer/Compiler.js
 * @venus-include ../../../src/ServiceContainer/CompilerPass/ApplyParentDefinition.js
 * @venus-include ../../../src/ServiceContainer/CompilerPass/RemoveAbstractDefinitions.js
 * @venus-include ../../../src/ServiceContainer/CompilerPass/ResolveParameterPlaceholder.js
 * @venus-include ../../../src/ServiceContainer/CompilerPass/ResolveReferencePlaceholder.js
 * @venus-include ../../../src/EventDispatcher/EventDispatcherInterface.js
 * @venus-include ../../../src/EventDispatcher/EventDispatcher.js
 * @venus-include ../../../src/EventDispatcher/EventSubscriberInterface.js
 * @venus-include ../../../src/EventDispatcherBundle/ContainerAwareEventDispatcher.js
 * @venus-code ../../../src/EventDispatcherBundle/CompilerPass/RegisterListenersPass.js
 */

describe('event dispatcher compiler pass', function () {
    var c, p;

    window.Foo = function () {};
    window.Bar = function () {};
    window.Foo.prototype = Object.create(Sy.EventDispatcher.EventSubscriberInterface.prototype, {
        getSubscribedEvents: {
            value: function () {
                return {
                    'foo': 'handle'
                };
            }
        }
    });

    beforeEach(function () {
        c = new Sy.ServiceContainer.Core();
        c.setCompiler(new Sy.ServiceContainer.Compiler());
        p = new Sy.EventDispatcherBundle.CompilerPass.RegisterListenersPass();

        c.addPass(p);

        c.set({
            'sy::core::event_dispatcher': {
                constructor: 'Sy.EventDispatcherBundle.ContainerAwareEventDispatcher',
                calls: [
                    ['setServiceContainer', ['@container']]
                ]
            }
        });
    });

    it('should register event listeners', function () {
        c.set({
            'service': {
                constructor: 'Foo',
                tags: [
                    {name: 'event.listener', event: 'foo', method: 'handle'}
                ]
            }
        });
        c.compile();
        expect(c.get('sy::core::event_dispatcher').hasListeners('foo')).toBe(true);
    });

    it('should throw when registering private event listeners', function () {
        c.set({
            'service': {
                constructor: 'Foo',
                private: true,
                tags: [
                    {name: 'event.listener', event: 'foo', method: 'handle'}
                ]
            }
        });
        expect(function () {
            c.compile();
        }).toThrow('The service "service" must be public as event listeners are lazy-loaded');
    });

    it('should throw when registering abstract event listeners', function () {
        c.set({
            'service': {
                constructor: 'Foo',
                abstract: true,
                tags: [
                    {name: 'event.listener', event: 'foo', method: 'handle'}
                ]
            }
        });
        expect(function () {
            c.compile();
        }).toThrow('The service "service" must not be abstract as event listeners are lazy-loaded');
    });

    it('should throw when registering event listeners without event', function () {
        c.set({
            'service': {
                constructor: 'Foo',
                tags: [
                    {name: 'event.listener', method: 'handle'}
                ]
            }
        });
        expect(function () {
            c.compile();
        }).toThrow('Event name must be set in tag');
    });

    it('should throw when registering event listeners without method', function () {
        c.set({
            'service': {
                constructor: 'Foo',
                tags: [
                    {name: 'event.listener', event: 'foo'}
                ]
            }
        });
        expect(function () {
            c.compile();
        }).toThrow('Listener method must be set in tag');
    });

    it('should register event subscribers', function () {
        c.set({
            'service': {
                constructor: 'Foo',
                tags: [
                    {name: 'event.subscriber'}
                ]
            }
        });
        c.compile();
        expect(c.get('sy::core::event_dispatcher').hasListeners('foo')).toBe(true);
    });

    it('should throw when registering private event subscribers', function () {
        c.set({
            'service': {
                constructor: 'Foo',
                private: true,
                tags: [
                    {name: 'event.subscriber'}
                ]
            }
        });
        expect(function () {
            c.compile();
        }).toThrow('The service "service" must be public as event listeners are lazy-loaded');
    });

    it('should throw when registering abstract event subscribers', function () {
        c.set({
            'service': {
                constructor: 'Foo',
                abstract: true,
                tags: [
                    {name: 'event.subscriber'}
                ]
            }
        });
        expect(function () {
            c.compile();
        }).toThrow('The service "service" must not be abstract as event listeners are lazy-loaded');
    });

    it('should throw when registering event subscribers not implementing interface', function () {
        c.set({
            'service': {
                constructor: 'Bar',
                tags: [
                    {name: 'event.subscriber'}
                ]
            }
        });
        expect(function () {
            c.compile();
        }).toThrow('The service "service" must implement the interface "Sy.EventDispatcher.EventSubscriberInterface"');
    });
});
