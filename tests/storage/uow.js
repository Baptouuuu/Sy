/**
 * @venus-library jasmine
 * @venus-include ../../vendor/Reflection.js/reflection.min.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/RegistryFactory.js
 * @venus-include ../../src/StateRegistryInterface.js
 * @venus-include ../../src/StateRegistry.js
 * @venus-include ../../src/EntityInterface.js
 * @venus-include ../../src/Entity.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Lib/Generator/UUID.js
 * @venus-include ../../src/Storage/EngineInterface.js
 * @venus-code ../../src/Storage/UnitOfWork.js
 */

describe('storage UnitOfWork', function () {

    var uow = new Sy.Storage.UnitOfWork();

    it('should throw if trying to set invalid state registry object', function () {
        expect(function () {
            uow.setStateRegistry({});
        }).toThrow('Invalid state registry');
    });

    it('should set the state registry', function () {
        var q = new Sy.StateRegistry();
        q.setRegistryFactory(new Sy.RegistryFactory());

        expect(uow.setStateRegistry(q)).toEqual(uow);
    });

    it('should throw if trying to set invalid engine', function () {
        expect(function () {
            uow.setEngine({});
        }).toThrow('Invalid engine');
    });

    it('should set the engine', function () {
        var e = new Sy.Storage.EngineInterface();

        expect(uow.setEngine(e)).toEqual(uow);
    });

    it('should throw if trying to set invalid generator', function () {
        expect(function () {
            uow.setGenerator({});
        }).toThrow('Invalid generator');
    });

    it('should set the generator', function () {
        var gen = new Sy.Lib.Generator.UUID();

        expect(uow.setGenerator(gen)).toEqual(uow);
    });

    it('should set the entity key', function () {
        expect(uow.setEntityKey('uuid')).toEqual(uow);
    });

    it('should schedule an entity for creation', function () {
        var e = new Sy.Entity();

        uow.handle(e);

        expect(uow.isScheduledForCreation(e)).toBe(true);
        expect(!!e.get('uuid')).toBe(true);
    });

    it('should schedule an entity for update', function () {
        var e = new Sy.Entity();

        e.set('uuid', 'foo');
        uow.handle(e);

        expect(uow.isScheduledForUpdate(e)).toBe(true);
    });

    it('should schedule an entity for removal', function () {
        var e = new Sy.Entity();

        e.set('uuid', 'removal-scheduled');
        uow.remove(e);

        expect(uow.isScheduledForRemoval(e)).toBe(true);
    });

    it('should cancel an entity creation schedule', function () {
        var e = new Sy.Entity();

        uow.handle(e);

        expect(uow.isScheduledForCreation(e)).toBe(true);

        uow.remove(e);

        expect(uow.isScheduledForCreation(e)).toBe(false);
        expect(uow.isScheduledForRemoval(e)).toBe(false);
    });

    it('should cancel an entity update schedule and schedule it for removal', function () {
        var e = new Sy.Entity();

        e.set('uuid', 'cancel-update');
        uow.handle(e);

        expect(uow.isScheduledForUpdate(e)).toBe(true);

        uow.remove(e);

        expect(uow.isScheduledForUpdate(e)).toBe(false);
        expect(uow.isScheduledForRemoval(e)).toBe(true);
    });

    it('should return the raw representation of the entity', function () {
        var e = new Sy.Entity();

        e.set('foo', 'bar');
        e.getFoo = function () {
            return 'bar';
        };

        expect(uow.getEntityData(e)).toEqual({
            foo: 'bar'
        });
    });

});
