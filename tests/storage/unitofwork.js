/**
 * @venus-library jasmine
 * @venus-include ../../vendor/bluebird/js/browser/bluebird.js
 * @venus-include ../../vendor/Reflection.js/reflection.js
 * @venus-include ../../vendor/observe-js/src/observe.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/StateRegistryInterface.js
 * @venus-include ../../src/StateRegistry.js
 * @venus-include ../../src/StateRegistryFactory.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/RegistryFactory.js
 * @venus-include ../../src/PropertyAccessor.js
 * @venus-include ../../src/EntityInterface.js
 * @venus-include ../../src/Entity.js
 * @venus-include ../../src/Lib/Logger/Interface.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Lib/Generator/UUID.js
 * @venus-include ../../src/Storage/Dbal/DriverInterface.js
 * @venus-include ../../src/Storage/IdentityMap.js
 * @venus-code ../../src/Storage/UnitOfWork.js
 */

describe('storage unit of work', function () {
    var Driver = function () {},
        stateF = new Sy.StateRegistryFactory(),
        Entity = function () {},
        uow;

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    stateF.setRegistryFactory(new Sy.RegistryFactory());

    Driver.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {
        read: {
            value: function (alias, id) {
                if (alias === 'simpletest') {
                    return new Promise(function (resolve) {
                        resolve({uuid: 'foo'});
                    });
                }
            }
        },
        findAll: {
            value: function (alias) {
                if (alias === 'simpletest') {
                    return new Promise(function (resolve) {
                        resolve([{}, {}]);
                    });
                }
            }
        },
        findBy: {
            value: function (alias) {
                if (alias === 'simpletest') {
                    return new Promise(function (resolve) {
                        resolve([{}, {}]);
                    });
                }
            }
        },
        create: {
            value: function () {
                return new Promise(function () {});
            }
        }
    });
    Entity.prototype = Object.create(Sy.Entity.prototype);

    beforeEach(function () {
        uow = new Sy.Storage.UnitOfWork();
    });

    it('should throw if setting invalid database driver', function () {
        expect(function () {
            uow.setDriver({});
        }).toThrow('Invalid database driver');
    });

    it('should set the database driver', function () {
        expect(uow.setDriver(new Sy.Storage.Dbal.DriverInterface())).toEqual(uow);
    });

    it('should throw if trying to set invalid identity map', function () {
        expect(function () {
            uow.setIdentityMap({});
        }).toThrow('Invalid identity map');
    });

    it('should set the identity map', function () {
        var map = new Sy.Storage.IdentityMap();
        expect(uow.setIdentityMap(map)).toEqual(uow);
        expect(uow.getIdentityMap()).toEqual(map);
    });

    it('should throw if setting invalid entities state registry', function () {
        expect(function () {
            uow.setEntitiesRegistry({});
        }).toThrow('Invalid state registry');
    });

    it('should set the entities state registry', function () {
        expect(uow.setEntitiesRegistry(new Sy.StateRegistry())).toEqual(uow);
    });

    it('should throw if setting invalid property accessor', function () {
        expect(function () {
            uow.setPropertyAccessor({});
        }).toThrow('Invalid property accessor');
    });

    it('should set the property accessor', function () {
        expect(uow.setPropertyAccessor(new Sy.PropertyAccessor())).toEqual(uow);
    });

    it('should throw is setting invalid states state registry', function () {
        expect(function () {
            uow.setStatesRegistry({});
        }).toThrow('Invalid state registry');
    });

    it('should set the states state registry', function () {
        expect(uow.setStatesRegistry(new Sy.StateRegistry())).toEqual(uow);
    });

    it('should throw if trying to set invalid logger', function () {
        expect(function () {
            uow.setLogger({});
        }).toThrow('Invalid logger');
    });

    it('should set the logger', function () {
        expect(uow.setLogger(new Sy.Lib.Logger.Interface())).toEqual(uow);
    });

    it('should throw if trying to set invalid generator', function () {
        expect(function () {
            uow.setGenerator({});
        }).toThrow('Invalid generator');
    });

    it('should set the generator', function () {
        expect(uow.setGenerator(new Sy.Lib.Generator.UUID())).toEqual(uow);
    });

    it('should find an entity', function () {
        var map = new Sy.Storage.IdentityMap(),
            returned;

        map.set('simpletest', Sy.Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor());

        returned = uow.find('simpletest', 'foo');

        expect(returned instanceof Promise).toBe(true);

        returned
            .then(function (e) {
                expect(e instanceof Sy.Entity).toBe(true);
                expect(e.get('uuid')).toEqual('foo');
            })
            .catch(function () {
                expect(false).toBe(true);
            });
    });

    it('should find all entities', function () {
        var map = new Sy.Storage.IdentityMap(),
            returned;

        map.set('simpletest', Sy.Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor());

        returned = uow.findAll('simpletest');

        expect(returned instanceof Promise).toBe(true);

        returned
            .then(function (d) {
                expect(d instanceof Array).toBe(true);
                expect(d.length).toEqual(2);
                expect(d[0] instanceof Sy.Entity).toBe(true);
                expect(d[1] instanceof Sy.Entity).toBe(true);
            })
            .catch(function () {
                expect(false).toBe(true);
            });
    });

    it('should find entities by criteria', function () {
        var map = new Sy.Storage.IdentityMap(),
            returned;

        map.set('simpletest', Sy.Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor());

        returned = uow.findBy('simpletest', 'simpletest', 'value', 2);

        expect(returned instanceof Promise).toBe(true);

        returned
            .then(function (d) {
                expect(d instanceof Array).toBe(true);
                expect(d.length).toEqual(2);
                expect(d[0] instanceof Sy.Entity).toBe(true);
                expect(d[1] instanceof Sy.Entity).toBe(true);
            })
            .catch(function () {
                expect(false).toBe(true);
            });
    });

    it('should return the same entity instance when retrieved multiple times', function () {
        var map = new Sy.Storage.IdentityMap(),
            returned,
            entity;

        map.set('simpletest', Sy.Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor());

        returned = uow.find('simpletest', 'foo');

        expect(returned instanceof Promise).toBe(true);

        returned
            .then(function (e) {
                entity = e;
            })
            .then(function () {
                uow
                    .find('simpletest', 'foo')
                    .then(function (e) {
                        expect(e).toBe(entity);
                    });
            })
            .catch(function () {
                expect(false).toBe(true);
            });
    });

    it('should throw if trying to persist invalid entity', function () {
        expect(function () {
            uow.persist({});
        }).toThrow('Invalid entity');
    });

    it('should persist a new entity', function () {
        var map = new Sy.Storage.IdentityMap(),
            entity = new Sy.Entity(),
            returned;

        map.set('simpletest', Sy.Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor())
            .setGenerator(new Sy.Lib.Generator.UUID());

        expect(uow.persist(entity)).toEqual(uow);
        expect(uow.isScheduledForInsert(entity)).toBe(true);
    });

    it('should persist an already defined entity', function () {
        var map = new Sy.Storage.IdentityMap(),
            entity;

        map.set('simpletest', Sy.Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor());

        uow
            .find('simpletest', 'foo')
            .then(function (e) {
                expect(uow.persist(e)).toEqual(uow);
                expect(uow.isScheduledForUpdate(e)).toBe(true);
            });
    });

    it('should commit the changes to the database', function () {
        var map = new Sy.Storage.IdentityMap(),
            entity = new Sy.Entity();

        map.set('simpletest', Sy.Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor())
            .setGenerator(new Sy.Lib.Generator.UUID());

        uow
            .find('simpletest', 'foo')
            .then(function (e) {
                expect(uow.persist(e)).toBe(uow);
                expect(uow.isScheduledForUpdate(e)).toBe(true);
                expect(uow.commit()).toBe(uow);
                expect(uow.isScheduledForUpdate(e)).toBe(false);
            });

        uow.persist(entity);
        uow.commit();
        expect(uow.isScheduledForInsert(entity)).toBe(false);

        uow.remove(entity);
        uow.commit();
        expect(uow.isScheduledForDelete(entity)).toBe(false);
    });

    it('should throw if trying to remove invalid entity', function () {
        expect(function () {
            uow.remove({});
        }).toThrow('Invalid entity');
    });

    it('should prevent an entity from being created', function () {
        var map = new Sy.Storage.IdentityMap(),
            entity = new Sy.Entity();

        map.set('simpletest', Sy.Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor())
            .setGenerator(new Sy.Lib.Generator.UUID());

        uow.persist(entity);
        expect(uow.isScheduledForInsert(entity)).toBe(true);
        uow.remove(entity);
        expect(uow.isScheduledForInsert(entity)).toBe(false);
        expect(uow.isScheduledForDelete(entity)).toBe(false);
    });

    it('should plan an entity to be removed', function () {
        var map = new Sy.Storage.IdentityMap();

        map.set('simpletest', Sy.Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor())
            .setGenerator(new Sy.Lib.Generator.UUID());

        uow
            .find('simpletest', 'foo')
            .then(function (entity) {
                uow.remove(entity);
                expect(uow.isScheduledForDelete(entity)).toBe(true);
            });
    });

    it('should detach an entity', function () {
        var map = new Sy.Storage.IdentityMap(),
            entity = new Sy.Entity();

        map.set('simpletest', Sy.Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor())
            .setGenerator(new Sy.Lib.Generator.UUID());

        uow.persist(entity);
        expect(uow.isManaged(entity)).toBe(true);
        expect(uow.detach(entity)).toBe(uow);
        expect(uow.isManaged(entity)).toBe(false);
        expect(uow.isScheduledForInsert(entity)).toBe(false);
    });

    it('should detach the entities for the specifed alias', function () {
        var map = new Sy.Storage.IdentityMap(),
            entity = new Sy.Entity(),
            local = new Entity();

        map.set('simpletest', Sy.Entity, 'uuid');
        map.set('local', Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor())
            .setGenerator(new Sy.Lib.Generator.UUID());

        uow.persist(entity);
        uow.persist(local);
        expect(uow.clear('local')).toBe(uow);
        expect(uow.isManaged(entity)).toBe(true);
        expect(uow.isManaged(local)).toBe(false);
    });

    it('should detach all entities', function () {
        var map = new Sy.Storage.IdentityMap(),
            entity = new Sy.Entity(),
            local = new Entity();

        map.set('simpletest', Sy.Entity, 'uuid');
        map.set('local', Entity, 'uuid');

        uow
            .setDriver(new Driver())
            .setEntitiesRegistry(stateF.make())
            .setStatesRegistry(stateF.make())
            .setIdentityMap(map)
            .setPropertyAccessor(new Sy.PropertyAccessor())
            .setGenerator(new Sy.Lib.Generator.UUID());

        uow.persist(entity);
        uow.persist(local);
        expect(uow.clear()).toBe(uow);
        expect(uow.isManaged(entity)).toBe(false);
        expect(uow.isManaged(local)).toBe(false);
    });
});
