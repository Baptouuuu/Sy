/**
 * @venus-library jasmine
 * @venus-include ../src/functions.js
 * @venus-include ../src/FactoryInterface.js
 * @venus-include ../src/RegistryInterface.js
 * @venus-include ../src/Registry.js
 * @venus-include ../src/RegistryFactory.js
 * @venus-include ../src/StateRegistryInterface.js
 * @venus-include ../src/StateRegistry.js
 * @venus-code ../src/StateRegistryFactory.js
 */

describe('state registry factory', function () {

    var factory = new Sy.StateRegistryFactory();

    factory.setRegistryFactory(
        new Sy.RegistryFactory()
    );

    it('should return itself', function () {

        var result = factory.setRegistryFactory(
            new Sy.RegistryFactory()
        );

        expect(result).toEqual(factory);

    });

    it('should return a registry', function () {

        var q = factory.make();

        expect(q instanceof Sy.StateRegistry).toBe(true);

    });

    it('should throw if invalid registry factory set', function () {

        expect(function () {
            factory.setRegistryFactory({});
        }).toThrow('Invalid factory');

    });

});