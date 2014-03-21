/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/Storage/EngineFactory/Core.js
 * @venus-include ../../src/Storage/EngineInterface.js
 * @venus-include ../../src/Storage/RepositoryFactory.js
 * @venus-include ../../src/Storage/Repository.js
 * @venus-include ../../src/Storage/Manager.js
 * @venus-include ../../src/Storage/ManagerFactory.js
 */

describe('storage manager factory', function () {

    it('should throw if invalid engine factory', function () {

        var mf = new Sy.Storage.ManagerFactory();

        expect(function () {
            mf.setEngineFactory({});
        }).toThrow('Invalid engine factory');

    });

    it('should set engine factory', function () {

        var mf = new Sy.Storage.ManagerFactory(),
            ef = new Sy.Storage.EngineFactory.Core();

        expect(mf.setEngineFactory(ef)).toEqual(mf);
        expect(mf.engineFact).toEqual(ef);

    });

    it('should throw if invalid repository factory', function () {

        var mf = new Sy.Storage.ManagerFactory();

        expect(function () {
            mf.setRepositoryFactory({});
        }).toThrow('Invalid repository factory');

    });

    it('should set repository factory', function () {

        var mf = new Sy.Storage.ManagerFactory(),
            rf = new Sy.Storage.RepositoryFactory();

        expect(mf.setRepositoryFactory(rf)).toEqual(mf);
        expect(mf.repositoryFact).toEqual(rf);

    });

    it('should return manager', function () {

        var mf = new Sy.Storage.ManagerFactory(),
            mockEF = function () {},
            mockRF = function () {},
            m;

        mockEF.prototype = Object.create(Sy.Storage.EngineFactory.Core.prototype, {

            make: {
                value: function () {

                    var mock = function () {};

                    mock.prototype = Object.create(Sy.Storage.EngineInterface.prototype);

                    return new mock();

                }
            }

        });

        mockRF.prototype = Object.create(Sy.Storage.RepositoryFactory.prototype, {

            make: {
                value: function () {

                    var mock = function () {};

                    mock.prototype = Object.create(Sy.Storage.Repository.prototype);

                    return new mock();

                }
            }

        });

        mf.setEngineFactory(new mockEF());
        mf.setRepositoryFactory(new mockRF());

        m = mf.make(
            'foo',
            {
                type: 'foo',
                version: 1,
                mapping: ['Foo::Bar']
            },
            [{
                name: 'Foo::Bar',
                repository: function () {},
                entity: function () {},
                indexes: [],
                uuid: 'uuid'
            }]
        );

        expect(m instanceof Sy.Storage.Manager).toBe(true);

    });

});