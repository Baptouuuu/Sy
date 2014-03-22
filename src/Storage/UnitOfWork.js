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
        value: function (queue) {}
    },

    /**
     * Set the engine it will use to apply modifications to
     *
     * @param {Sy.Storage.EngineInterface} engine
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setEngine: {
        value: function (engine) {}
    },

    /**
     * Set generator to build entities UUIDs
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setGenerator: {
        value: function (generator) {}
    },

    /**
     * Set the entity identifier key name
     *
     * @param {String} key
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setEntityKey: {
        value: function (key) {}
    },

    /**
     * Create or update entities
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    handle: {
        value: function (entity) {}
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
        value: function (entity) {}
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
        value: function (event, entity) {}
    },

    /**
     * Check if the entity is scheduled to be created
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForCreation: {
        value: function (entity) {}
    },

    /**
     * Check if the entity is scheduled to be updated
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForUpdate: {
        value: function (entity) {}
    },

    /**
     * Check if the entity is sheduled to be removed
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForRemoval: {
        value: function (entity) {}
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
