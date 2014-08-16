/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-code ../../src/ServiceContainer/Alias.js
 */

describe('servcie container alias', function () {

    it('should return the original service id', function () {
        var a = new Sy.ServiceContainer.Alias('foo');

        expect(a.toString()).toEqual('foo');
    });

});
