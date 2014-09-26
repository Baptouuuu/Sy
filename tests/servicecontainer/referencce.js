/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-code ../../src/ServiceContainer/Reference.js
 */

describe('servcie container reference', function () {

    it('should return the original service id', function () {
        var r = new Sy.ServiceContainer.Reference('foo');

        expect(r.toString()).toEqual('foo');
    });

});
