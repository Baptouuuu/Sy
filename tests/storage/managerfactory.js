/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/Storage/Dbal/Factory.js
 * @venus-include ../../src/Storage/Dbal/DriverInterface.js
 * @venus-include ../../src/Storage/RepositoryFactory.js
 * @venus-include ../../src/Storage/IdentityMap.js
 * @venus-include ../../src/Storage/UnitOfWork.js
 * @venus-include ../../src/Storage/UnitOfWorkFactory.js
 * @venus-include ../../src/Storage/Manager.js
 * @venus-code ../../src/Storage/ManagerFactory.js
 */

describe('storage manager factory', function () {
    var DbalFactory = function () {},
        UOWF = function () {},
        factory;

    DbalFactory.prototype = Object.create(Sy.Storage.Dbal.Factory.prototype, {
        make: {
            value: function () {
                return new Sy.Storage.Dbal.DriverInterface();
            }
        }
    });
    UOWF.prototype = Object.create(Sy.Storage.UnitOfWorkFactory.prototype, {
        make: {
            value: function () {
                return new Sy.Storage.UnitOfWork();
            }
        }
    });

    beforeEach(function () {
        factory = new Sy.Storage.ManagerFactory();
    });

    it('should set the managers definitions', function () {
        expect(factory.setDefinitions({})).toEqual(factory);
    });

    it('should throw if trying to set invalid dbal factory', function () {
        expect(function () {
            factory.setDbalFactory({});
        }).toThrow('Invalid dbal factory');
    });

    it('should throw the dbal factory', function () {
        expect(factory.setDbalFactory(new Sy.Storage.Dbal.Factory())).toEqual(factory);
    });

    it('should throw if trying to set invalid repository factory', function () {
        expect(function () {
            factory.setRepositoryFactory({});
        }).toThrow('Invalid repository factory');
    });

    it('should set the repository factory', function () {
        expect(factory.setRepositoryFactory(new Sy.Storage.RepositoryFactory())).toEqual(factory);
    });

    it('should throw if trying to set invalid unit of work factory', function () {
        expect(function () {
            factory.setUnitOfWorkFactory({});
        }).toThrow('Invalid unit of work factory');
    });

    it('should set the unit of work factory', function () {
        expect(factory.setUnitOfWorkFactory(new Sy.Storage.UnitOfWorkFactory())).toEqual(factory);
    });

    it('should throw if trying to get a manager without a definition', function () {
        factory.setDefinitions({});

        expect(function () {
            factory.make('default');
        }).toThrow('Unknown manager definition');
    });

    it('should return a manager', function () {
        factory
            .setDefinitions({
                foo: {
                    connection: 'default'
                }
            })
            .setDbalFactory(new DbalFactory())
            .setRepositoryFactory(new Sy.Storage.RepositoryFactory())
            .setUnitOfWorkFactory(new UOWF);

        expect(factory.make('foo') instanceof Sy.Storage.Manager).toBe(true);
    });
});
