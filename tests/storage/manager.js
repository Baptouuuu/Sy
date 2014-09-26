/**
 * @venus-library jasmine
 * @venus-include ../../vendor/bluebird/js/browser/bluebird.js
 * @venus-include ../../vendor/Reflection.js/reflection.min.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/EntityInterface.js
 * @venus-include ../../src/Storage/Dbal/DriverInterface.js
 * @venus-include ../../src/Storage/IdentityMap.js
 * @venus-include ../../src/Storage/UnitOfWork.js
 * @venus-include ../../src/Storage/RepositoryFactory.js
 * @venus-code ../../src/Storage/Manager.js
 */

describe('storage manager', function () {
    var RepoFactory = function () {},
        UOW = function () {
            this.map = new Sy.Storage.IdentityMap();
        },
        Entity = function () {},
        manager;

    RepoFactory.prototype = Object.create(Sy.Storage.RepositoryFactory.prototype, {
        make: {
            value: function (em, alias) {
                return {em: em, alias: alias};
            }
        }
    });
    UOW.prototype = Object.create(Sy.Storage.UnitOfWork.prototype, {
        find: {
            value: function () {
                return new Promise(function () {});
            }
        },
        persist: {
            value: function () {
                return this;
            }
        },
        commit: {
            value: function () {
                return this;
            }
        },
        remove: {
            value: function () {
                return this;
            }
        },
        clear: {
            value: function () {
                return this;
            }
        },
        detach: {
            value: function () {
                return this;
            }
        },
        isManaged: {
            value: function (entity) {
                return Object.getPrototypeOf(entity) === Entity.prototype;
            }
        }
    });
    Entity.prototype = Object.create(Sy.EntityInterface.prototype);

    beforeEach(function () {
        manager = new Sy.Storage.Manager();
    });

    it('should throw if trying to set invalid driver', function () {
        expect(function () {
            manager.setDriver({});
        }).toThrow('Invalid dbal driver');
    });

    it('should set the driver', function () {
        var driver = new Sy.Storage.Dbal.DriverInterface();

        expect(manager.setDriver(driver)).toEqual(manager);
        expect(manager.getDriver()).toEqual(driver);
    });

    it('should throw if trying to set invalid unit of work', function () {
        expect(function () {
            manager.setUnitOfWork({});
        }).toThrow('Invalid unit of work');
    });

    it('should set the unit of work', function () {
        var uow = new Sy.Storage.UnitOfWork();

        expect(manager.setUnitOfWork(uow)).toEqual(manager);
        expect(manager.getUnitOfWork()).toEqual(uow);
    });

    it('should throw if trying to set invalid mappings array', function () {
        expect(function () {
            manager.setMappings({});
        }).toThrow('Invalid mappings array');
    });

    it('should set the mappings array', function () {
        expect(manager.setMappings(['foo'])).toEqual(manager);
        expect(manager.isHandled('foo')).toBe(true);
    });

    it('should throw if trying to set invalid repository factory', function () {
        expect(function () {
            manager.setRepositoryFactory({});
        }).toThrow('Invalid repository factory');
    });

    it('should set the repository factory', function () {
        manager.setMappings(['foo']);
        expect(manager.setRepositoryFactory(new RepoFactory())).toEqual(manager);
        expect(manager.getRepository('foo')).toEqual({em: manager, alias: 'foo'});
    });

    it('should throw if trying to find unhandled entity type', function () {
        manager.setMappings(['foo']);
        expect(function () {
            manager.find('bar', 'foo');
        }).toThrow('Entity not handled by this manager');
    });

    it('should return a promise when trying to find an entity', function () {
        manager.setMappings(['foo']);
        manager.setUnitOfWork(new UOW());
        expect(manager.find('foo', 'id') instanceof Promise).toBe(true);
    });

    it('should throw if trying to persist unhandled entity', function () {
        var uow = new UOW();

        uow.getIdentityMap().set('foo', Entity, 'uuid');
        manager.setMappings(['foo']);
        manager.setUnitOfWork(uow);

        expect(function () {
            manager.persist({});
        }).toThrow('Entity not handled by this manager');
    });

    it('should persist an entity', function () {
        var uow = new UOW();

        uow.getIdentityMap().set('foo', Entity, 'uuid');
        manager.setMappings(['foo']);
        manager.setUnitOfWork(uow);

        expect(manager.persist(new Entity())).toEqual(manager);
    });

    it('should flush the manager', function () {
        var uow = new UOW();

        manager.setUnitOfWork(uow);

        expect(manager.flush()).toEqual(manager);
    });

    it('should throw if trying to remove unhandled entity', function () {
        var uow = new UOW();

        uow.getIdentityMap().set('foo', Entity, 'uuid');
        manager.setMappings(['foo']);
        manager.setUnitOfWork(uow);

        expect(function () {
            manager.remove({});
        }).toThrow('Entity not handled by this manager');
    });

    it('should remove an entity', function () {
        var uow = new UOW();

        uow.getIdentityMap().set('foo', Entity, 'uuid');
        manager.setMappings(['foo']);
        manager.setUnitOfWork(uow);

        expect(manager.remove(new Entity())).toEqual(manager);
    });

    it('should detach all entities', function () {
        manager.setUnitOfWork(new UOW());

        expect(manager.clear()).toEqual(manager);
    });

    it('should throw if trying to detach unhandled entity', function () {
        var uow = new UOW();

        uow.getIdentityMap().set('foo', Entity, 'uuid');
        manager.setMappings(['foo']);
        manager.setUnitOfWork(uow);

        expect(function () {
            manager.detach({});
        }).toThrow('Entity not handled by this manager');
    });

    it('should detach an entity', function () {
        var uow = new UOW();

        uow.getIdentityMap().set('foo', Entity, 'uuid');
        manager.setMappings(['foo']);
        manager.setUnitOfWork(uow);

        expect(manager.detach(new Entity())).toEqual(manager);
    });

    it('should throw if trying to get repository for unhandled entity', function () {
        manager.setMappings(['foo']);

        expect(function () {
            manager.getRepository('bar');
        }).toThrow('Entity not handled by this manager');
    });

    it('should throw if trying to check if entity is managed when not handled by the manager', function () {
        var uow = new UOW();

        uow.getIdentityMap().set('foo', Entity, 'uuid');
        manager.setMappings(['foo']);
        manager.setUnitOfWork(uow);

        expect(function () {
            manager.contains({});
        }).toThrow('Entity not handled by this manager');
    });

    it('should say the entity is managed by the manager', function () {
        var uow = new UOW();

        uow.getIdentityMap().set('foo', Entity, 'uuid');
        manager.setMappings(['foo']);
        manager.setUnitOfWork(uow);

        expect(manager.contains(new Entity())).toBe(true);
    });

    it('should say the entity is handled by the manager', function () {
        manager.setMappings([]);
        expect(manager.isHandled('foo')).toBe(true);

        manager.setMappings(['bar']);
        expect(manager.isHandled('bar')).toBe(true);
    });
});
