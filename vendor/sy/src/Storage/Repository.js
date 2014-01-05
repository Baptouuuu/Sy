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
                    this.queue.set(
                        'remove',
                        key,
                        key
                    );
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

            var toRemove = this.queue.has('remove') ? this.queue.get('remove') : [],
                toUpdate = this.queue.has('update') ? this.queue.get('update') : [],
                toCreate = this.queue.has('create') ? this.queue.get('create') : [];

            for (var i = 0, l = toRemove.length; i < l; i++) {
                this.engine.remove(
                    this.name,
                    toRemove[i],
                    this.removalListener.bind(this)
                );
            }

            for (i = 0, l = toUpdate.length; i < l; i++) {
                this.engine.update(
                    this.name,
                    toUpdate[i].get(this.entityKey),
                    toUpdate[i].getRaw(),
                    this.updateListener.bind(this)
                );
            }

            for (i = 0, l = toCreate.length; i < l; i++) {
                this.engine.create(
                    this.name,
                    toCreate[i].getRaw(),
                    this.createListener.bind(this)
                );
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    findOneBy: {
        value: function (args) {

            if (args.index === this.entityKey) {
                this.engine.read(
                    this.name,
                    args.value,
                    function (object) {
                        args.callback(
                            this.buildEntity(object)
                        );
                    }.bind(this)
                );
            } else {
                args.limit = 1;
                this.findBy(args);
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    findBy: {
        value: function (args) {

            this.engine.find(
                this.name,
                {
                    index: args.index,
                    value: args.value,
                    callback: function (results) {
                        this.findListener(args.callback, results);
                    }.bind(this),
                    limit: args.limit
                }
            );

            return this;

        }
    },

    /**
     * Engine removal listener callback
     *
     * @private
     * @param {string} identifier
     *
     * @return {void}
     */

    removalListener: {
        value: function (identifier) {

            this.queue.remove('remove', identifier);

        }
    },

    /**
     * Engine update listener callback
     *
     * @private
     * @param {object} object
     *
     * @return {void}
     */

    updateListener: {
        value: function (object) {

            this.queue.remove('update', object[this.entityKey]);

        }
    },

    /**
     * Engine create listener callback
     *
     * @private
     * @param {string} identifier
     *
     * @return {void}
     */

    createListener: {
        value: function (identifier) {

            this.queue.remove('create', identifier);

        }
    },

    /**
     * Intercept raw results and transform objects array into enitites one
     *
     * @private
     * @param {function} callback
     * @param {Array} results
     *
     * @return {void}
     */

    findListener: {
        value: function (callback, results) {

            var data = [];

            for (var i = 0, l = results.length; i < l; i++) {
                data.push(
                    this.buildEntity(results[i])
                );
            }

            callback(data);

        }
    },

    /**
     * Transform a raw object into an entity
     *
     * @private
     * @param {object} object
     *
     * @return {Sy.EntityInterface}
     */

    buildEntity: {
        value: function (object) {

            return new this.entityConstructor(object);

        }
    }

});