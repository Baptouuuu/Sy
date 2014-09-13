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

    var DriverFactory = function () {},
        factory;

    DriverFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {
        make: {
            value: function (dbname) {
                if (dbname === 'foo') {
                    return {};
                } else {
                    return new Sy.Storage.Dbal.DriverInterface();
                }
            }
        }
    });

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

    it('should throw if making driver for unknown connection', function () {
        expect(function () {
            factory.make('unknown');
        }).toThrow('No connection defined with the name "unknown"');
    });

    it('should throw if unknown driver for a connection', function () {
        factory.setConnections({
            foo: {
                driver: 'unknown'
            }
        });
        factory.setFactoriesRegistry(new Sy.Registry());

        expect(function () {
            factory.make('foo');
        }).toThrow('Unknown driver "unknown"');
    });

    it('should throw if driver not implementing the driver interface', function () {
        factory.setConnections({
            foo: {
                driver: 'foo',
                dbname: 'foo'
            }
        });
        factory.setFactoriesRegistry(new Sy.Registry());
        factory.setDriverFactory('foo', new DriverFactory());

        expect(function () {
            factory.make('foo');
        }).toThrow('Invalid driver instance');
    });

    it('should return a valid driver', function () {
        factory.setConnections({
            foo: {
                driver: 'foo',
                dbname: 'bar'
            }
        });
        factory.setFactoriesRegistry(new Sy.Registry());
        factory.setDriverFactory('foo', new DriverFactory());

        expect(factory.make('foo') instanceof Sy.Storage.Dbal.DriverInterface).toBe(true);
    });

});
