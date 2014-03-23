/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/ControllerInterface.js
 * @venus-include ../../src/Controller.js
 * @venus-include ../../src/Lib/Mediator.js
 * @venus-include ../../src/ParamProxy.js
 * @venus-include ../../src/ServiceContainerInterface.js
 * @venus-include ../../src/ServiceContainer.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/ViewScreen.js
 * @venus-code ../../src/Kernel/ControllerManager.js
 */

describe('kernel controller manager', function () {

    var manager = new Sy.Kernel.ControllerManager(),
        mockVS = function () {},
        mockVS2 = function () {},
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
    mockController.prototype = Object.create(Sy.Controller.prototype, {
        setBundle: {value: function () {return this;}},
        setMediator: {value: function () {return this;}},
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

    it('should throw if trying to set invalid mediator', function () {
        expect(function () {
            manager.setMediator({});
        }).toThrow('Invalid mediator');
    });

    it('should set the mediator', function () {
        expect(manager.setMediator(new Sy.Lib.Mediator())).toEqual(manager);
    });

    it('should throw if trying to set invalid service container', function () {
        expect(function () {
            manager.setServiceContainer({});
        }).toThrow('Invalid service container');
    });

    it('should set the service container', function () {
        expect(manager.setServiceContainer(new Sy.ServiceContainer())).toEqual(manager);
    });

    it('should set the whether or not to cache controllers', function () {
        expect(manager.setCache(true)).toEqual(manager);
    });

    it('should set the cache length', function () {
        expect(manager.setCacheLength(3)).toEqual(manager);
    });

    it('should add the controller to the loaded controllers', function () {
        var vs = new mockVS();

        manager.registerController('foo::bar', mockController);
        manager.onDisplayListener(vs);

        expect(manager.loaded.has('foo::bar')).toBe(true);
    });

    it('should load a new controller and destroy the hold one', function () {
         var vs = new mockVS2();

        manager.registerController('foo::baz', mockController);
        manager.setCache(false);
        manager.onDisplayListener(vs);

        expect(manager.loaded.has('foo::baz')).toBe(true);
        expect(manager.loaded.has('foo::bar')).toBe(false);
    });

});
