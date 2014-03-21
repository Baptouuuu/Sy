/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/FactoryInterface.js
 * @venus-include ../../../src/RegistryInterface.js
 * @venus-include ../../../src/Registry.js
 * @venus-include ../../../src/Storage/EngineInterface.js
 * @venus-include ../../../src/Storage/StoreMapperInterface.js
 * @venus-include ../../../src/Storage/EngineFactory/AbstractFactory.js
 * @venus-include ../../../src/Storage/EngineFactory/Core.js
 */

describe('storage engine factory', function () {

    var fact;

    beforeEach(function () {
        fact = new Sy.Storage.EngineFactory.Core();
        fact.setRegistry(new Sy.Registry());
    });

    it('should return itself', function () {

        expect(fact.setRegistry(new Sy.RegistryInterface())).toEqual(fact);
        expect(fact.setEngineFactory(
            'foo',
            new Sy.Storage.EngineFactory.AbstractFactory(),
            new Sy.Storage.StoreMapperInterface()
        )).toEqual(fact);

    });

    it('should throw if engine factory is not implementing factory interface', function () {

        expect(function () {
            fact.setEngineFactory('foo', {});
        }).toThrow('Invalid factory');

    });

    it('should throw if store mapper is not implementing store mapper interface', function () {

        expect(function () {
            fact.setEngineFactory(
                'foo',
                new Sy.Storage.EngineFactory.AbstractFactory(),
                {}
            );
        }).toThrow('Invalid mapper');

    });

    it('should throw when trying to use an engine name twice', function () {

        fact.setEngineFactory(
            'foo',
            new Sy.Storage.EngineFactory.AbstractFactory(),
            new Sy.Storage.StoreMapperInterface()
        );

        expect(function () {
            fact.setEngineFactory(
                'foo',
                new Sy.Storage.EngineFactory.AbstractFactory(),
                new Sy.Storage.StoreMapperInterface()
            );
        }).toThrow('Factory "foo" already defined');

    });

    it('should throw when making unknown engine', function () {

        expect(function () {
            fact.make({type: 'unknown'}, []);
        }).toThrow('Unknown factory named "unknown"');

    });

});