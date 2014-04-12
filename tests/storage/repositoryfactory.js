/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/RegistryFactory.js
 * @venus-include ../../src/EntityInterface.js
 * @venus-include ../../src/StateRegistryInterface.js
 * @venus-include ../../src/StateRegistry.js
 * @venus-include ../../src/StateRegistryFactory.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Storage/RepositoryInterface.js
 * @venus-include ../../src/Storage/Repository.js
 * @venus-include ../../src/Storage/UnitOfWork.js
 * @venus-include ../../src/Storage/UnitOfWorkFactory.js
 * @venus-code ../../src/Storage/RepositoryFactory.js
 */

describe('storage repository factory', function () {

    var fact = new Sy.Storage.RepositoryFactory(),
        registryFactory = new Sy.RegistryFactory(),
        stateRegistryFactory = new Sy.StateRegistryFactory(),
        mockEntity = function () {
            Sy.EntityInterface.call(this);
        };

    stateRegistryFactory.setRegistryFactory(registryFactory);
    mockEntity.prototype = Object.create(Sy.EntityInterface.prototype);

    it('should return itself', function () {

        expect(fact.setRegistryFactory(registryFactory)).toEqual(fact);
        expect(fact.setMeta([])).toEqual(fact);
        expect(fact.setUOWFactory(new Sy.Storage.UnitOfWorkFactory())).toEqual(fact);

    });

    it('should throw if invalid registry factory', function () {

        expect(function () {
            fact.setRegistryFactory({});
        }).toThrow('Invalid registry factory');

    });

    it('should throw if invalid unit of work factory', function () {

        expect(function () {
            fact.setUOWFactory({});
        }).toThrow('Invalid factory');

    });

    it('should throw if unknown repository alias', function () {

        expect(function () {
            fact.make('foo');
        }).toThrow('Unknown repository "foo"');

    });

    it('should throw if invalid repository constructed', function () {

        var uowf = new Sy.Storage.UnitOfWorkFactory(),
            qf = new Sy.StateRegistryFactory();

        qf.setRegistryFactory(new Sy.RegistryFactory());
        uowf.setStateRegistryFactory(qf);
        uowf.setGenerator(new Sy.Lib.Generator.Interface());

        fact.setRegistryFactory(registryFactory);
        fact.setMeta([{
            name: 'invalid',
            repository: function () {},
            entity: function () {},
            indexes: [],
            uuid: 'uuid'
        }]);
        fact.setUOWFactory(uowf);

        expect(function () {
            fact.make('invalid');
        }).toThrow('Invalid repository "invalid"');

    });

    it('should return configured repository', function () {

        var repo;

        fact.setRegistryFactory(registryFactory);
        fact.setMeta([{
            name: 'valid',
            repository: Sy.Storage.Repository,
            entity: mockEntity,
            indexes: ['foo'],
            uuid: 'uuid'
        }]);

        repo = fact.make('valid');

        expect(repo instanceof Sy.Storage.RepositoryInterface).toBe(true);
        expect(repo.name).toEqual('valid');
        expect(repo.entityKey).toEqual('uuid');
        expect(repo.entityConstructor).toEqual(mockEntity);
        expect(repo.indexes).toEqual(['foo']);

    });

});