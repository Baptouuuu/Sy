namespace('Sy.Storage');

/**
 * Handles entity modifications done through repositories
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.UnitOfWork = function () {
    this.states = null;
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
     * Set a state registry to hold scheduled entities
     *
     * @param {Sy.StateRegistryInterface} states
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setStateRegistry: {
        value: function (states) {

            if (!(states instanceof Sy.StateRegistryInterface)) {
                throw new TypeError('Invalid state registry');
            }

            this.states = states;

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
                this.states.set(
                    this.SCHEDULED_FOR_CREATION,
                    entity.get(this.entityKey),
                    entity
                );
            } else if (this.isScheduledForCreation(entity)) {
                this.states.set(
                    this.SCHEDULED_FOR_CREATION,
                    entity.get(this.entityKey),
                    entity
                );
            } else {
                this.states.set(
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
                this.states.remove(
                    this.SCHEDULED_FOR_CREATION,
                    entity.get(this.entityKey)
                );
            } else if (this.isScheduledForUpdate(entity)) {
                this.states.remove(
                    this.SCHEDULED_FOR_UPDATE,
                    entity.get(this.entityKey)
                );

                this.states.set(
                    this.SCHEDULED_FOR_REMOVAL,
                    entity.get(this.entityKey),
                    entity
                );
            } else {
                this.states.set(
                    this.SCHEDULED_FOR_REMOVAL,
                    entity.get(this.entityKey),
                    entity
                );
            }

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

            return this.states.has(
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
        value: function () {

            var toRemove = this.states.has(this.SCHEDULED_FOR_REMOVAL) ? this.states.get(this.SCHEDULED_FOR_REMOVAL) : [],
                toUpdate = this.states.has(this.SCHEDULED_FOR_UPDATE) ? this.states.get(this.SCHEDULED_FOR_UPDATE) : [],
                toCreate = this.states.has(this.SCHEDULED_FOR_CREATION) ? this.states.get(this.SCHEDULED_FOR_CREATION) : [];

            for (var i = 0, l = toRemove.length; i < l; i++) {
                this.engine.remove(
                    this.name,
                    toRemove[i].get(this.entityKey),
                    this.removalListener.bind(this)
                );
            }

            for (i = 0, l = toUpdate.length; i < l; i++) {
                this.engine.update(
                    this.name,
                    toUpdate[i].get(this.entityKey),
                    this.getEntityData(toUpdate[i]),
                    this.updateListener.bind(this)
                );
            }

            for (i = 0, l = toCreate.length; i < l; i++) {
                this.engine.create(
                    this.name,
                    this.getEntityData(toCreate[i]),
                    this.createListener.bind(this)
                );
            }

            return this;

        }
    },

    /**
     * Return the raw representation of the entity
     *
     * @private
     * @param {Sy.EntityInterface} entity
     *
     * @return {Object}
     */

    getEntityData: {
        value: function (entity) {

            var raw = {},
                keys = Object.keys(entity.attributes),
                refl = new ReflectionObject(entity),
                getter;

            for (var i = 0, l = keys.length; i < l; i++) {
                getter = 'get' + keys[i].substr(0, 1).toUpperCase() + keys[i].substr(1);
                if (refl.hasMethod(getter)) {
                    raw[keys[i]] = refl.getMethod(getter).call();
                } else {
                    raw[keys[i]] = entity.get(keys[i]);
                }

                if (raw[keys[i]] instanceof Sy.EntityInterface) {
                    raw[keys[i]] = raw[keys[i]].get(raw[keys[i]].UUID);
                }
            }

            return raw;

        }
    },

    /**
     * Engine removal listener callback
     *
     * @private
     * @param {String} identifier
     *
     * @return {void}
     */

    removalListener: {
        value: function (identifier) {

            this.states.remove('remove', identifier);

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

            this.states.remove('update', object[this.entityKey]);

        }
    },

    /**
     * Engine create listener callback
     *
     * @private
     * @param {String} identifier
     *
     * @return {void}
     */

    createListener: {
        value: function (identifier) {

            this.states.remove('create', identifier);

        }
    }

});
