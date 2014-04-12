/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/RegistryFactory.js
 * @venus-include ../../src/StateRegistryInterface.js
 * @venus-include ../../src/StateRegistry.js
 * @venus-include ../../src/StateRegistryFactory.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Storage/UnitOfWork.js
 * @venus-code ../../src/Storage/UnitOfWorkFactory.js
 */

describe('storage UnitOfWork', function () {

    var factory = new Sy.Storage.UnitOfWorkFactory();

    it('should throw if trying to set invalid generator', function () {
        expect(function () {
            factory.setGenerator({});
        }).toThrow('Invalid generator');
    });

    it('should set the generator', function () {
        expect(factory.setGenerator(new Sy.Lib.Generator.Interface())).toEqual(factory);
    });

    it('should throw if trying to set invalid state registry factory', function () {
        expect(function () {
            factory.setStateRegistryFactory({});
        }).toThrow('Invalid state registry factory');
    });

    it('should set the state registry factory', function () {
        var f = new Sy.StateRegistryFactory();

        f.setRegistryFactory(new Sy.RegistryFactory());

        expect(factory.setStateRegistryFactory(f)).toEqual(factory);
    });

    it('should make an unit of work', function () {
        expect(factory.make('foo', 'uuid') instanceof Sy.Storage.UnitOfWork).toBe(true);
    });

});
