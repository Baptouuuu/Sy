/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Lib/Generator/Interface.js
 * @venus-include ../../../src/Lib/Generator/UUID.js
 */

describe('uuid generator', function () {

    it('should generate a random string of 4 characters', function () {

        var gen = new Sy.Lib.Generator.UUID();

        expect(gen.s4().length).toEqual(4);

    });

    it('should generate a string as described in the doc', function () {

        var gen = new Sy.Lib.Generator.UUID();

        expect(gen.generate()).toMatch(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/i);

    });

});