/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/RegistryFactory.js
 * @venus-include ../../src/EntityInterface.js
 * @venus-include ../../src/QueueInterface.js
 * @venus-include ../../src/Queue.js
 * @venus-include ../../src/QueueFactory.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Storage/RepositoryInterface.js
 * @venus-include ../../src/Storage/Repository.js
 * @venus-code ../../src/Storage/RepositoryFactory.js
 */

describe('storage repository factory', function () {

    var fact = new Sy.Storage.RepositoryFactory(),
        registryFactory = new Sy.RegistryFactory(),
        queueFactory = new Sy.QueueFactory();

    queueFactory.setRegistryFactory(registryFactory);

    it('should return itself', function () {

        expect(fact.setMetaRegistry(new Sy.RegistryInterface())).toEqual(fact);
        expect(fact.setRepoRegistry(new Sy.RegistryInterface())).toEqual(fact);
        expect(fact.setMeta([])).toEqual(fact);
        expect(fact.setGenerator(new Sy.Lib.Generator.Interface())).toEqual(fact);
        expect(fact.setQueueFactory(queueFactory)).toEqual(fact);

    });

    it('should throw if invalid meta registry', function () {

        expect(function () {
            fact.setMetaRegistry({});
        }).toThrow('Invalid registry');

    });

    it('should throw if invalid repo registry', function () {

        expect(function () {
            fact.setRepoRegistry({});
        }).toThrow('Invalid registry');

    });

    it('should throw if invalid generator', function () {

        expect(function () {
            fact.setGenerator({});
        }).toThrow('Invalid generator');

    });

    it('should throw if unknown repository alias', function () {

        expect(function () {
            fact.make('foo');
        }).toThrow('Unknown repository "foo"');

    });

    it('should throw if invalid repository constructed', function () {

        fact.setMetaRegistry(new Sy.Registry());
        fact.setMeta([{
            name: 'invalid',
            repository: function () {},
            entity: function () {},
            indexes: [],
            uuid: 'uuid'
        }]);

        expect(function () {
            fact.make('invalid');
        }).toThrow('Invalid repository "invalid"');

    });

    it('should return configured repository', function () {

        var repo;

        fact.setMetaRegistry(new Sy.Registry());
        fact.setMeta([{
            name: 'valid',
            repository: Sy.Storage.Repository,
            entity: Sy.EntityInterface,
            indexes: ['foo'],
            uuid: 'uuid'
        }]);

        repo = fact.make('valid');

        expect(repo instanceof Sy.Storage.RepositoryInterface).toBe(true);
        expect(repo.queue instanceof Sy.Queue).toBe(true);
        expect(repo.name).toEqual('valid');
        expect(repo.generator instanceof Sy.Lib.Generator.Interface).toBe(true);
        expect(repo.entityKey).toEqual('uuid');
        expect(repo.entityConstructor).toEqual(Sy.EntityInterface);
        expect(repo.indexes).toEqual(['foo']);

    });

});