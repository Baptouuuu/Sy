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

        expect(repo.setQueue(new Sy.QueueInterface())).toEqual(repo);
        expect(repo.setName('foo')).toEqual(repo);
        expect(repo.setGenerator(new Sy.Lib.Generator.Interface())).toEqual(repo);
        expect(repo.setEngine(new Sy.Storage.EngineInterface())).toEqual(repo);
        expect(repo.setEntityKey('uuid')).toEqual(repo);
        expect(repo.setEntityConstructor(Sy.EntityInterface)).toEqual(repo);
        expect(repo.setIndexes([])).toEqual(repo);
        expect(repo.persist(new Sy.EntityInterface())).toEqual(repo);
        expect(repo.remove(new Sy.EntityInterface())).toEqual(repo);

    });

    it('should throw if not handled entity type', function () {

        var repo = new Sy.Storage.Repository();

        repo.setEntityConstructor(Sy.EntityInterface);

        expect(function () {
            repo.persist({});
        }).toThrow('Entity not handled by the repository');

    });

    it('should add the entity to the queue in create state', function () {

        var repo = new Sy.Storage.Repository(),
            queue = queueFactory.make(),
            entity = new Sy.Entity();

        repo.setQueue(queue);
        repo.setGenerator(new Sy.Lib.Generator.UUID());
        repo.setEntityKey('uuid');
        repo.setEntityConstructor(Sy.Entity);

        repo.persist(entity);

        expect(entity.get('uuid')).not.toEqual(undefined);
        expect(queue.has('create', entity.get('uuid'))).toBe(true);

        var uuid = entity.get('uuid');

        repo.persist(entity);

        expect(entity.get('uuid')).toEqual(uuid);
        expect(queue.has('create', uuid)).toBe(true);
        expect(queue.has('update', uuid)).toBe(false);

    });

    it('should add the entity to the queue in update state', function () {

        var repo = new Sy.Storage.Repository(),
            queue = queueFactory.make(),
            entity = new Sy.Entity();

        repo.setQueue(queue);
        repo.setGenerator(new Sy.Lib.Generator.UUID());
        repo.setEntityKey('uuid');
        repo.setEntityConstructor(Sy.Entity);

        entity.set('uuid', 'bar');

        repo.persist(entity);

        expect(entity.get('uuid')).toEqual('bar');
        expect(queue.has('update', 'bar')).toBe(true);

    });

    it('should add the entity to the queue in remove state', function () {

        var repo = new Sy.Storage.Repository(),
            queue = queueFactory.make(),
            entity = new Sy.Entity();

        repo.setQueue(queue);
        repo.setGenerator(new Sy.Lib.Generator.UUID());
        repo.setEntityKey('uuid');
        repo.setEntityConstructor(Sy.Entity);

        repo.persist(entity);

        expect(queue.has('create', entity.get('uuid'))).toBe(true);

        repo.remove(entity);

        expect(queue.has('create', entity.get('uuid'))).toBe(false);

        repo.persist(entity);

        expect(queue.has('update', entity.get('uuid'))).toBe(true);

        repo.remove(entity);

        expect(queue.has('update', entity.get('uuid'))).toBe(false);
        expect(queue.has('remove', entity.get('uuid'))).toBe(true);

    });

    it('should remove elements from queue when flushed', function () {

        runs(function () {
            var repo = new Sy.Storage.Repository(),
                eCreate = new Sy.Entity(),
                eUpdate = new Sy.Entity(),
                eRemove = new Sy.Entity();

            this.queue = queueFactory.make();

            repo.setQueue(this.queue);
            repo.setGenerator(new Sy.Lib.Generator.UUID());
            repo.setEntityKey('uuid');
            repo.setEntityConstructor(Sy.Entity);
            repo.setEngine(new mockEngine());

            eUpdate.set('uuid', 'foo');
            eRemove.set('uuid', 'bar');

            repo.persist(eCreate);
            repo.persist(eUpdate);
            repo.remove(eRemove);

            repo.flush();
        });

        waits(200);

        runs(function () {
            expect(this.queue.get('create').length).toEqual(0);
            expect(this.queue.get('update').length).toEqual(0);
            expect(this.queue.get('remove').length).toEqual(0);
        });

    });

    it('should return an entity by its uuid', function () {

        var repo = new Sy.Storage.Repository(),
            queue = queueFactory.make(),
            self = this;

        repo.setQueue(queue);
        repo.setGenerator(new Sy.Lib.Generator.UUID());
        repo.setEntityKey('uuid');
        repo.setEntityConstructor(mockEntity);
        repo.setEngine(new mockEngine());

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
            queue = queueFactory.make(),
            self = this;

        repo.setQueue(queue);
        repo.setGenerator(new Sy.Lib.Generator.UUID());
        repo.setEntityKey('uuid');
        repo.setEntityConstructor(mockEntity);
        repo.setEngine(new mockEngine());
        repo.setIndexes(['foo']);

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
            queue = queueFactory.make(),
            self = this;

        repo.setQueue(queue);
        repo.setGenerator(new Sy.Lib.Generator.UUID());
        repo.setEntityKey('uuid');
        repo.setEntityConstructor(mockEntity);
        repo.setEngine(new mockEngine());
        repo.setIndexes(['foo']);

        repo.findBy({
            index: 'foo',
            value: 'bar',
            callback: function (array) {
                expect(array instanceof Array).toBe(true);
                expect(array.length).toEqual(2);
            }
        });

    });

});