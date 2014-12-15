/**
 * @venus-library jasmine
 * @venus-include ../../vendor/Reflection.js/reflection.min.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/PropertyAccessor.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/ControllerInterface.js
 * @venus-include ../../src/Controller.js
 * @venus-include ../../src/EventDispatcher/EventDispatcherInterface.js
 * @venus-include ../../src/EventDispatcher/EventDispatcher.js
 * @venus-include ../../src/ParamProxy.js
 * @venus-include ../../src/ServiceContainer/Core.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/ViewScreen.js
 * @venus-include ../../src/View/Event/ViewPortEvent.js
 * @venus-code ../../src/Kernel/ControllerManager.js
 */

describe('kernel controller manager', function () {

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    var manager = new Sy.Kernel.ControllerManager(),
        mockVS = function () {},
        mockVS2 = function () {},
        mockInvalidVS = function () {},
        mockController = function () {},
        destroyed = false;

    mockVS.prototype = Object.create(Sy.View.ViewScreen.prototype, {
        getNode: {
            value: function () {
                var n = document.createElement('section');
                n.dataset.syController = 'foo::bar';
                return n;
            }
        }
    });
    mockVS2.prototype = Object.create(Sy.View.ViewScreen.prototype, {
        getNode: {
            value: function () {
                var n = document.createElement('section');
                n.dataset.syController = 'foo::baz';
                return n;
            }
        }
    });
    mockInvalidVS.prototype = Object.create(Sy.View.ViewScreen.prototype, {
        getNode: {
            value: function () {
                var n = document.createElement('section');
                n.dataset.syController = 'unknown';
                return n;
            }
        }
    });
    mockController.prototype = Object.create(Sy.Controller.prototype, {
        setBundle: {value: function () {return this;}},
        setDispatcher: {value: function () {return this;}},
        destroy: {
            value: function () {
                destroyed = true;
            }
        }
    });

    it('should throw if trying to set invalid registry', function () {
        expect(function () {
            manager.setMetaRegistry({});
        }).toThrow('Invalid registry');
        expect(function () {
            manager.setLoadedControllersRegistry({});
        }).toThrow('Invalid registry');
    });

    it('should set the registries', function () {
        expect(manager.setMetaRegistry(new Sy.Registry())).toEqual(manager);
        expect(manager.setLoadedControllersRegistry(new Sy.Registry())).toEqual(manager);
    });

    it('should throw if trying to register invalid controller', function () {
        expect(function () {
            manager.registerController('foo', {});
        }).toThrow('Invalid controller constructor');
    });

    it('should register a new controller', function () {
        expect(manager.registerController('base', Sy.Controller)).toEqual(manager);
    });

    it('should throw if trying to set invalid event dispatcher', function () {
        expect(function () {
            manager.setDispatcher({});
        }).toThrow('Invalid event dispatcher');
    });

    it('should set the event dispatcher', function () {
        expect(manager.setDispatcher(new Sy.EventDispatcher.EventDispatcher())).toEqual(manager);
    });

    it('should throw if trying to set invalid service container', function () {
        expect(function () {
            manager.setServiceContainer({});
        }).toThrow('Invalid service container');
    });

    it('should set the service container', function () {
        expect(manager.setServiceContainer(new Sy.ServiceContainer.Core())).toEqual(manager);
    });

    it('should set the whether or not to cache controllers', function () {
        expect(manager.setCache(true)).toEqual(manager);
    });

    it('should set the cache length', function () {
        expect(manager.setCacheLength(3)).toEqual(manager);
    });

    it('should add the controller to the loaded controllers', function () {
        var vs = new mockVS(),
            evt = new Sy.View.Event.ViewPortEvent(vs);

        manager.registerController('foo::bar', mockController);
        manager.onDisplayListener(evt);

        expect(manager.loaded.has('foo::bar')).toBe(true);
    });

    it('should load a new controller and destroy the hold one', function () {
        var vs = new mockVS2(),
            evt = new Sy.View.Event.ViewPortEvent(vs);

        manager.registerController('foo::baz', mockController);

        expect(manager.isControllerBuilt('foo::baz')).toBe(false);

        manager.setCache(false);
        manager.onDisplayListener(evt);

        expect(manager.isControllerBuilt('foo::baz')).toBe(true);
        expect(manager.isControllerBuilt('foo::bar')).toBe(false);
    });

    it('should built a controller', function () {
        var vs = new mockVS2();

        expect(manager.buildController(vs)).toEqual(manager);
        expect(manager.isControllerBuilt('foo::baz')).toBe(true);
        expect(manager.getController('foo::baz') instanceof Sy.Controller).toBe(true);
    });

    it('should throw if trying to build a controller from invalid viewscreen', function () {
        expect(function () {
            manager.buildController({});
        }).toThrow('Invalid viewscreen');
    });

    it('should throw if unknown controller for the viewscreen', function () {
        expect(function () {
            manager.buildController(new mockInvalidVS());
        }).toThrow('The controller with the alias "unknown" is undefined');
    });

});
