/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/StateRegistryInterface.js
 * @venus-include ../../src/StateRegistry.js
 * @venus-include ../../src/StateRegistryFactory.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/RegistryFactory.js
 * @venus-include ../../src/PropertyAccessor.js
 * @venus-include ../../src/Lib/Logger/Interface.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Lib/Mediator.js
 * @venus-include ../../src/Storage/IdentityMap.js
 * @venus-include ../../src/Storage/UnitOfWork.js
 * @venus-code ../../src/Storage/UnitOfWorkFactory.js
 */

describe('storage unit of work factory', function () {
    var f;

    beforeEach(function () {
        f = new Sy.Storage.UnitOfWorkFactory();
    });

    it('should throw if trying to set invalid entities metadata', function () {
        expect(function () {
            f.setEntitiesMetadata({});
        }).toThrow('Invalid metadata array');
    });

    it('should set the entities metadata', function () {
        expect(f.setEntitiesMetadata([{alias: 'foo', entity: function () {}, uuid: 'uuid'}])).toBe(f);
    });

    it('should throw if trying to set invalid state registry factory', function () {
        expect(function () {
            f.setStateRegistryFactory({});
        }).toThrow('Invalid state registry factory');
    });

    it('should set the state registry factory', function () {
        expect(f.setStateRegistryFactory(new Sy.StateRegistryFactory())).toBe(f);
    });

    it('should throw if trying to set invalid property accessor', function () {
        expect(function () {
            f.setPropertyAccessor({});
        }).toThrow('Invalid property accessor');
    });

    it('should set the property accessor', function () {
        expect(f.setPropertyAccessor(new Sy.PropertyAccessor())).toBe(f);
    });

    it('should throw if trying to set invalid logger', function () {
        expect(function () {
            f.setLogger({});
        }).toThrow('Invalid logger');
    });

    it('should set the logger', function () {
        expect(f.setLogger(new Sy.Lib.Logger.Interface())).toBe(f);
    });

    it('should throw if trying to set invalid generator', function () {
        expect(function () {
            f.setGenerator({});
        }).toThrow('Invalid generator');
    });

    it('should set the generator', function () {
        expect(f.setGenerator(new Sy.Lib.Generator.Interface())).toBe(f);
    });

    it('should throw if trying to set invalid mediator', function () {
        expect(function () {
            f.setMediator({});
        }).toThrow('Invalid mediator');
    });

    it('should set the mediator', function () {
        expect(f.setMediator(new Sy.Lib.Mediator())).toBe(f);
    });

    it('should return a unit of work', function () {
        var s = new Sy.StateRegistryFactory();

        s.setRegistryFactory(new Sy.RegistryFactory());

        f
            .setEntitiesMetadata([])
            .setStateRegistryFactory(s)
            .setPropertyAccessor(new Sy.PropertyAccessor())
            .setLogger(new Sy.Lib.Logger.Interface())
            .setGenerator(new Sy.Lib.Generator.Interface())
            .setMediator(new Sy.Lib.Mediator());

        expect(function () {
            expect(f.make() instanceof Sy.Storage.UnitOfWork).toBe(true);
        }).not.toThrow();
    });
});
