/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/Storage/Core.js
 * @venus-include ../../src/Storage/Manager.js
 */

describe('core storage', function () {

    var core = new Sy.Storage.Core();

    core.setRegistry(new Sy.Registry());

    it('should register a new manager', function () {

        var manager = new Sy.Storage.Manager();

        core.setManager('foo', manager);

        expect(core.getManager('foo')).toEqual(manager);

    });

    it('should return itself', function () {

        var manager = new Sy.Storage.Manager();

        expect(core.setManager('foo', manager)).toEqual(core);
        expect(core.setRegistry(new Sy.Registry())).toEqual(core);

    });

    it('should throw if invalid manager', function () {

        expect(function () {
            core.setManager('foo', {});
        }).toThrow('Invalid manager type');

    });

    it('should return manager without specifying name if it is main', function () {

        var manager = new Sy.Storage.Manager();

        core.setManager('main', manager);

        expect(core.getManager()).toEqual(manager);

    });

});