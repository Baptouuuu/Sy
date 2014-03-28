/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/RegistryFactory.js
 * @venus-include ../../src/QueueInterface.js
 * @venus-include ../../src/Queue.js
 * @venus-include ../../src/QueueFactory.js
 * @venus-include ../../src/EntityInterface.js
 * @venus-include ../../src/Entity.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Lib/Generator/UUID.js
 * @venus-include ../../src/Storage/EngineInterface.js
 * @venus-include ../../src/Storage/RepositoryInterface.js
 * @venus-include ../../src/Storage/UnitOfWork.js
 * @venus-code ../../src/Storage/Repository.js
 */

describe('storage repository', function () {

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    var mockEngine = function () {},
        mockEntity = function (data) {
            Sy.Entity.call(this);
            this.set(data);
        },
        queueFactory = new Sy.QueueFactory();
    mockEngine.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {

        read: {
            value: function (store, identifier, callback) {
                callback({uuid: identifier});
            }
        },

        create: {
            value: function (store, object, callback) {
                callback(object.uuid);
            }
        },
        update: {
            value: function (store, identifier, object, callback) {
                callback(object);
            }
        },
        remove: {
            value: function (store, identifier, callback) {
                callback(identifier);
            }
        },
        find: {
            value: function (store, args) {
                if (args.limit === 1) {
                    args.callback([{uuid: 'foo', foo: 'bar'}]);
                } else {
                    args.callback([
                        {uuid: 'foo', foo: 'bar'},
                        {uuid: 'baz', foo: 'bar'}
                    ]);
                }
            }
        }

    });
    mockEntity.prototype = Object.create(Sy.Entity.prototype);

    queueFactory.setRegistryFactory(
        new Sy.RegistryFactory()
    );

    it('should return itself', function () {

        var repo = new Sy.Storage.Repository();

        expect(repo.setUnitOfWork(new Sy.Storage.UnitOfWork())).toEqual(repo);
        expect(repo.setName('foo')).toEqual(repo);
        expect(repo.setEngine(new Sy.Storage.EngineInterface())).toEqual(repo);
        expect(repo.setEntityKey('uuid')).toEqual(repo);
        expect(repo.setEntityConstructor(mockEntity)).toEqual(repo);
        expect(repo.setIndexes([])).toEqual(repo);
        expect(repo.setCacheRegistry(new Sy.Registry())).toEqual(repo);

    });

    it('should throw if not handled entity type', function () {

        var repo = new Sy.Storage.Repository();

        repo.setEntityConstructor(mockEntity);
        repo.setUnitOfWork(new Sy.Storage.UnitOfWork());

        expect(function () {
            repo.persist({});
        }).toThrow('Entity not handled by the repository');

    });

    it('should return the unit of work', function () {

        var repo = new Sy.Storage.Repository(),
            uow = new Sy.Storage.UnitOfWork();

        repo.setUnitOfWork(uow);

        expect(repo.getUnitOfWork()).toEqual(uow);

    });

    it('should return an entity by its uuid', function () {

        var repo = new Sy.Storage.Repository(),
            uow = new Sy.Storage.UnitOfWork(),
            queue = queueFactory.make(),
            self = this;

        uow
            .setQueue(queue)
            .setGenerator(new Sy.Lib.Generator.UUID());

        repo.setUnitOfWork(uow);
        repo.setEntityKey('uuid');
        repo.setEntityConstructor(mockEntity);
        repo.setEngine(new mockEngine());
        repo.setCacheRegistry(new Sy.Registry());

        repo.findOneBy({
            index: 'uuid',
            value: 'bar',
            callback: function (entity) {
                expect(entity instanceof mockEntity).toBe(true);
                expect(entity.get('uuid')).toEqual('bar');
            }
        });

    });

    it('should return an entity by its index', function () {

        var repo = new Sy.Storage.Repository(),
            uow = new Sy.Storage.UnitOfWork(),
            queue = queueFactory.make(),
            self = this;

        uow
            .setQueue(queue)
            .setGenerator(new Sy.Lib.Generator.UUID());

        repo.setUnitOfWork(uow);
        repo.setEntityKey('uuid');
        repo.setEntityConstructor(mockEntity);
        repo.setEngine(new mockEngine());
        repo.setIndexes(['foo']);
        repo.setCacheRegistry(new Sy.Registry());

        repo.findOneBy({
            index: 'foo',
            value: 'bar',
            callback: function (array) {
                expect(array instanceof Array).toBe(true);
                expect(array.length).toEqual(1);
            }
        });

    });

    it('should return entities by index', function () {

        var repo = new Sy.Storage.Repository(),
            uow = new Sy.Storage.UnitOfWork(),
            queue = queueFactory.make(),
            self = this;

        uow
            .setQueue(queue)
            .setGenerator(new Sy.Lib.Generator.UUID());

        repo.setUnitOfWork(uow);
        repo.setEntityKey('uuid');
        repo.setEntityConstructor(mockEntity);
        repo.setEngine(new mockEngine());
        repo.setIndexes(['foo']);
        repo.setCacheRegistry(new Sy.Registry());

        repo.findBy({
            index: 'foo',
            value: 'bar',
            callback: function (array) {
                expect(array instanceof Array).toBe(true);
                expect(array.length).toEqual(2);
            }
        });

    });

    it('should throw if trying to set invalid cache registry', function () {
        var repo = new Sy.Storage.Repository();

        expect(function () {
            repo.setCacheRegistry({});
        }).toThrow('Invalid registry');
    });

    it('should return the exact same entity object', function () {
        var repo = new Sy.Storage.Repository(),
            qf = new Sy.QueueFactory(),
            uow = new Sy.Storage.UnitOfWork(),
            e = new Sy.Entity();

        e.set('uuid', 'foo');

        qf.setRegistryFactory(new Sy.RegistryFactory());
        uow
            .setQueue(qf.make())
            .setEntityKey('uuid');
        repo
            .setUnitOfWork(uow)
            .setCacheRegistry(new Sy.Registry())
            .setEntityKey('uuid')
            .setEntityConstructor(Sy.Entity)
            .persist(e)
            .findOneBy({
                index: 'uuid',
                value: 'foo',
                callback: function (r) {
                    expect(e).toEqual(r);
                }
            });
    });

});