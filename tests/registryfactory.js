/**
 * @venus-library jasmine
 * @venus-include ../src/functions.js
 * @venus-include ../src/FactoryInterface.js
 * @venus-include ../src/RegistryInterface.js
 * @venus-include ../src/Registry.js
 * @venus-code ../src/RegistryFactory.js
 */

describe('registry factory', function () {

    var factory = new Sy.RegistryFactory();

    it('should return a registry', function () {

        var r = factory.make();

        expect(r instanceof Sy.Registry).toBe(true);

    });

});