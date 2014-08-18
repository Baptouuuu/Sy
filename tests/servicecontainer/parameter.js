/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-code ../../src/ServiceContainer/Parameter.js
 */

describe('servcie container parameter', function () {

    it('should return the original service id', function () {
        var p = new Sy.ServiceContainer.Parameter('foo');

        expect(p.toString()).toEqual('foo');
    });

});
