/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/Storage/ManagerFactory.js
 * @venus-code ../../src/Storage/Core.js
 */

describe('storage', function () {
    var Factory = function () {Sy.Storage.ManagerFactory.call(this)},
        core;

    Factory.prototype = Object.create(Sy.Storage.ManagerFactory.prototype, {
        make: {
            value: function (name) {
                if (name === 'default') {
                    return {name: 'default'};
                } else {
                    return {name: name};
                }
            }
        }
    });

    beforeEach(function () {
        core = new Sy.Storage.Core();
        core.setManagersRegistry(new Sy.Registry());
    });

    it('should have a default manager set to default', function () {
        expect(core.defaultName).toEqual('default');
    });

    it('should throw if trying to set invalid registry', function () {
        expect(function () {
            core.setManagersRegistry({});
        }).toThrow('Invalid registry');
    });

    it('should set the managers registry', function () {
        expect(core.setManagersRegistry(new Sy.Registry())).toEqual(core);
    });

    it('should set a default manager name', function () {
        expect(core.setDefaultManager('foo')).toEqual(core);
        expect(core.defaultName).toEqual('foo');
    });

    it('should throw if trying to set invalid manager factory', function () {
        expect(function () {
            core.setManagerFactory({});
        }).toThrow('Invalid manager factory');
    });

    it('should set the manager factory', function () {
        expect(core.setManagerFactory(new Sy.Storage.ManagerFactory())).toEqual(core);
    });

    it('should return a manager with the default name if none specified', function () {
        var factory = new Factory();

        core.setManagerFactory(factory);

        expect(core.getManager()).toEqual({name: 'default'});
    });

    it('should return a manager with the specified name', function () {
        var factory = new Factory();

        core.setManagerFactory(factory);

        expect(core.getManager('foo')).toEqual({name: 'foo'});
    });

    it('should return the same instance when getting manager twice', function () {
        var factory = new Factory(),
            manager;

        core.setManagerFactory(factory);

        manager = core.getManager('foo');

        expect(core.getManager('foo')).toEqual(manager);
    });
});
