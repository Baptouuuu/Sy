namespace('Sy.Storage');

/**
 * Default implementation of the entity repository
 *
 * @package Sy
 * @subpackage Storage
 * @implements {Sy.Storage.RepositoryInterface}
 * @class
 */

Sy.Storage.Repository = function () {

    this.engine = null;
    this.entityKey = null;
    this.entityConstructor = null;
    this.queue = null;
    this.generator = null;
    this.name = null;

};

Sy.Storage.Repository.prototype = Object.create(Sy.Storage.RepositoryInterface.prototype, {

    /**
     * Set a queue to handle modifications of entities
     *
     * @param {Sy.QueueInterface} queue
     *
     * @return {Sy.Storage.Repository}
     */

    setQueue: {
        value: function (queue) {

            if (!(queue instanceof Sy.QueueInterface)) {
                throw new TypeError('Invalid queue');
            }

            this.queue = queue;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setGenerator: {
        value: function (generator) {

            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.Storage.EngineInterface)) {
                throw new TypeError('Invalid engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setEntityKey: {
        value: function (key) {

            this.entityKey = key;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setEntityConstructor: {
        value: function (constructor) {

            var tmp = new constructor();

            if (!(tmp instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity constructor');
            }

            this.entityConstructor = constructor;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setIndexes: {
        value: function (indexes) {

            if (!(indexes instanceof Array)) {
                throw new TypeError('Invalid indexes definition');
            }

            this.indexes = indexes;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    persist: {
        value: function (entity) {

            if (!(entity instanceof this.entityConstructor)) {
                throw new TypeError('Entity not handled by the repository');
            }

            if (entity.get(this.entityKey) === undefined) {

                entity.set(this.entityKey, this.generator.generate());

                this.queue.set(
                    'create',
                    entity.get(this.entityKey),
                    entity
                );

            } else if (this.queue.has('create', entity.get(this.entityKey))) {

                this.queue.set(
                    'create',
                    entity.get(this.entityKey),
                    entity
                );

            } else {

                this.queue.set(
                    'update',
                    entity.get(this.entityKey),
                    entity
                );

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (entity) {

            if (!(entity instanceof this.entityConstructor)) {
                throw new TypeError('Entity not handled by the repository');
            }

            var key = entity.get(this.entityKey);

            if (key) {

                if (this.queue.has('create', key)) {
                    this.queue.remove('create', key);
                } else if (this.queue.has('update', key)) {
                    this.queue.remove('update', key);
                } else {
                    this.queue.set(
                        'remove',
                        key,
                        key
                    );
                }

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    flush: {
        value: function () {

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    findOneBy: {
        value: function (args) {

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    findBy: {
        value: function (args) {

            return this;

        }
    }

});