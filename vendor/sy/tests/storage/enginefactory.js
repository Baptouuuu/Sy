/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/factoryinterface.js
 * @venus-include ../../src/storage/engineinterface.js
 * @venus-include ../../src/storage/enginefactory.js
 */

describe('storage engine factory', function () {

    it('should return itself', function () {

        var fact = new Sy.Storage.EngineFactory();

        expect(fact.setEngine('foo', function () {})).toEqual(fact);

    });

    it('should throw if engine constructor is not a function', function () {

        var fact = new Sy.Storage.EngineFactory();

        expect(function () {
            fact.setEngine('foo', {});
        }).toThrow('Invalid engine constructor');

    });

    it('should throw when trying to use an engine name twice', function () {

        var fact = new Sy.Storage.EngineFactory();

        fact.setEngine('foo', function () {});

        expect(function () {
            fact.setEngine('foo', function () {});
        }).toThrow('Engine name already used');

    });

    it('should throw when making unknown engine', function () {

        var fact = new Sy.Storage.EngineFactory();

        expect(function () {
            fact.make('unknown', 1, []);
        }).toThrow('Specified engine does not exist');

    });

    it('should throw if constructor does not return valid engine', function () {

        var fact = new Sy.Storage.EngineFactory();

        fact.setEngine('invalid', function () {
            return {};
        });

        expect(function () {
            fact.make('invalid', 1, []);
        }).toThrow('Invalid engine');

    });

    it('should return engine', function () {

        var fact = new Sy.Storage.EngineFactory(),
            engine;

        fact.setEngine('valid', function () {
            return new Sy.Storage.EngineInterface();
        });

        engine = fact.make('valid', 1, []);

        expect(engine instanceof Sy.Storage.EngineInterface).toBe(true);

    });

});