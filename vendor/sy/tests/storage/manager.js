/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/Storage/Manager.js
 * @venus-include ../../src/Storage/RepositoryFactory.js
 * @venus-include ../../src/Storage/EngineInterface.js
 * @venus-include ../../src/Storage/RepositoryInterface.js
 */

describe('storage manager', function () {

    it('should throw if invalid repo factory', function () {

        var m = new Sy.Storage.Manager();

        expect(function () {
            m.setRepositoryFactory({});
        }).toThrow('Invalid repository factory type');

    });

    it('should set the repo factory', function () {

        var m = new Sy.Storage.Manager(),
            r = new Sy.Storage.RepositoryFactory();

        expect(m.setRepositoryFactory(r)).toEqual(m);
        expect(m.repositoryFact).toEqual(r);

    });

    it('should throw if invalid mapping', function () {

        var m = new Sy.Storage.Manager();

        expect(function () {
            m.setMapping({});
        }).toThrow('Invalid argument');

    });

    it('should set the entity mapping', function () {

        var m = new Sy.Storage.Manager();

        expect(m.setMapping([])).toEqual(m);
        expect(m.mapping).toEqual([]);

    });

    it('should throw if invalid engine', function () {

        var m = new Sy.Storage.Manager();

        expect(function () {
            m.setEngine({});
        }).toThrow('Invalid engine');

    });

    it('should set the engine', function () {

        var m = new Sy.Storage.Manager(),
            e = new Sy.Storage.EngineInterface();

        expect(m.setEngine(e)).toEqual(m);
        expect(m.engine).toEqual(e);

    });

    it('should throw if unknown repository alias in mapping', function () {

        var m = new Sy.Storage.Manager();

        m.setMapping([
            {
                name: 'Foo::Bar',
                repository: function () {},
                entity: function () {},
                indexes: [],
                uuid: 'uuid'
            }
        ]);

        expect(function () {
            m.getRepository('unknown');
        }).toThrow('The manager does not handle "unknown"');

    });

    it('should return a repository', function () {

        var mockRepo = function () {},
            mockFact = function () {},
            m = new Sy.Storage.Manager(),
            mock;

        mockRepo.prototype = Object.create(Sy.Storage.RepositoryInterface.prototype);
        mockFact.prototype = Object.create(Sy.Storage.RepositoryFactory.prototype, {

            make: {
                value: function () {
                    return new mockRepo();
                }
            }

        });

        m.setRepositoryFactory(new mockFact());

        expect(m.getRepository() instanceof mockRepo).toBe(true);

    });

});