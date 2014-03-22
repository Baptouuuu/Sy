namespace('Sy.Storage');

/**
 * Handles entity modifications done through repositories
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.UnitOfWork = function () {
    this.queue = null;
    this.engine = null;
    this.generator = null;
    this.name = null;
    this.entityKey = null;
};
Sy.Storage.UnitOfWork.prototype = Object.create(Object.prototype, {

    SCHEDULED_FOR_CREATION: {
        value: 'create',
        writable: false
    },

    SCHEDULED_FOR_UPDATE: {
        value: 'update',
        writable: false
    },

    SCHEDULED_FOR_REMOVAL: {
        value: 'remove',
        writable: false
    },

    /**
     * Set a queue to hold scheduled entities
     *
     * @param {Sy.QueueInterface} queue
     *
     * @return {Sy.Storage.UnitOfWork}
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
     * Set the engine it will use to apply modifications to
     *
     * @param {Sy.Storage.EngineInterface} engine
     *
     * @return {Sy.Storage.UnitOfWork}
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
     * Set generator to build entities UUIDs
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWork}
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
     * Set the store name this uow depends on
     *
     * @param {String} name Store name
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    /**
     * Set the entity identifier key name
     *
     * @param {String} key
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setEntityKey: {
        value: function (key) {

            this.entityKey = key;

            return this;

        }
    },

    /**
     * Create or update entities
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    handle: {
        value: function (entity) {

            if (!(entity instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity');
            }

            if (!entity.get(this.entityKey)) {
                entity.set(
                    this.entityKey,
                    this.generator.generate()
                );
                this.queue.set(
                    this.SCHEDULED_FOR_CREATION,
                    entity.get(this.entityKey),
                    entity
                );
            } else if (this.isScheduledForCreation(entity)) {
                this.queue.set(
                    this.SCHEDULED_FOR_CREATION,
                    entity.get(this.entityKey),
                    entity
                );
            } else {
                this.queue.set(
                    this.SCHEDULED_FOR_UPDATE,
                    entity.get(this.entityKey),
                    entity
                );
            }

            return this;

        }
    },

    /**
     * Schedule an entity to be removed from storage
     * If the entity is scheduled to be created it prevents it
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    remove: {
        value: function (entity) {

            if (this.isScheduledForCreation(entity)) {
                this.queue.remove(
                    this.SCHEDULED_FOR_CREATION,
                    entity.get(this.entityKey)
                );
            } else if (this.isScheduledForUpdate(entity)) {
                this.queue.remove(
                    this.SCHEDULED_FOR_UPDATE,
                    entity.get(this.entityKey)
                );
            }

            this.queue.set(
                this.SCHEDULED_FOR_REMOVAL,
                entity.get(this.entityKey),
                entity
            );

        }
    },

    /**
     * Check if an entity is scheduled for the specific event
     *
     * @param {String} event
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledFor: {
        value: function (event, entity) {

            return this.queue.has(
                event,
                entity.get(this.entityKey)
            );

        }
    },

    /**
     * Check if the entity is scheduled to be created
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForCreation: {
        value: function (entity) {

            return this.isScheduledFor(
                this.SCHEDULED_FOR_CREATION,
                entity
            );

        }
    },

    /**
     * Check if the entity is scheduled to be updated
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForUpdate: {
        value: function (entity) {

            return this.isScheduledFor(
                this.SCHEDULED_FOR_UPDATE,
                entity
            );

        }
    },

    /**
     * Check if the entity is sheduled to be removed
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForRemoval: {
        value: function (entity) {

            return this.isScheduledFor(
                this.SCHEDULED_FOR_REMOVAL,
                entity
            );

        }
    },

    /**
     * Flush modifications to the engine
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    flush: {
        value: function () {}
    }

});
