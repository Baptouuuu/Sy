/**
 * @venus-library jasmine
 * @venus-include ../../../../vendor/moment/moment.js
 * @venus-include ../../../../src/functions.js
 * @venus-include ../../../../src/Lib/Logger/Handler/Interface.js
 * @venus-include ../../../../src/Lib/Logger/Interface.js
 * @venus-code ../../../../src/Lib/Logger/Handler/Console.js
 */

describe('console logger handler', function () {

    it('should not handle', function () {

        var handler = new Sy.Lib.Logger.Handler.Console('info');

        expect(handler.isHandling('error')).toBe(false);

    });

    it('should handle the level defined', function () {

        var handler = new Sy.Lib.Logger.Handler.Console('info');

        expect(handler.isHandling('info')).toBe(true);
        expect(handler.isHandling('foo')).toBe(false);

    });

    it('should return itself', function () {

        var handler = new Sy.Lib.Logger.Handler.Console('info');

        expect(handler.handle('name', 'info', 'foo')).toEqual(handler);

    });

    it('should return say that the level does not exist', function () {

        expect(function () {
            var handler = new Sy.Lib.Logger.Handler.Console('foo');
        }).toThrow('Unknown logger level');

    });

});