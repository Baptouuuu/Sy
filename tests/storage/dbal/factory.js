/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/FactoryInterface.js
 * @venus-include ../../../src/RegistryInterface.js
 * @venus-include ../../../src/Registry.js
 * @venus-include ../../../src/Storage/Dbal/DriverFactoryInterface.js
 * @venus-include ../../../src/Storage/Dbal/DriverInterface.js
 * @venus-code ../../../src/Storage/Dbal/Factory.js
 */

describe('storage dbal factory', function () {

    var factory;

    beforeEach(function () {
        factory = new Sy.Storage.Dbal.Factory();
        factory.setFactoriesRegistry(new Sy.Registry());
    });

    it('should set a new registry for the factories', function () {
        expect(factory.setFactoriesRegistry(new Sy.Registry())).toEqual(factory);
    });

    it('should throw if invalid registry', function () {
        expect(function () {
            factory.setFactoriesRegistry({});
        }).toThrow('Invalid registry');
    });

    it('should register a new driver factory', function () {
        expect(factory.setDriverFactory(
            'foo',
            new Sy.Storage.Dbal.DriverFactoryInterface()
        )).toEqual(factory);
    });

    it('should throw if invalid driver factory', function () {
        expect(function () {
            factory.setDriverFactory(
                'foo',
                {}
            );
        }).toThrow('Invalid driver factory');
    });

    it('should throw if a driver factory already exists', function () {
        factory.setDriverFactory(
            'foo',
            new Sy.Storage.Dbal.DriverFactoryInterface()
        );

        expect(function () {
            factory.setDriverFactory(
                'foo',
                new Sy.Storage.Dbal.DriverFactoryInterface()
            );
        }).toThrow('Can\'t redefine the driver factory "foo"');
    });

    it('should set the default connection name', function () {
        expect(factory.setDefaultConnectionName('foo')).toEqual(factory);
    });

    it('should set the connections', function () {
        expect(factory.setConnections({})).toEqual(factory);
    });

});
