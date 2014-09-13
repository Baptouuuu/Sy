namespace('Sy.Storage');

/**
 * Event fired before/after an entity is committed to the database
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.LifeCycleEvent = function (alias, entity) {
    this.alias = alias;
    this.entity = entity;
    this.aborted = false;
};
Sy.Storage.LifeCycleEvent.prototype = Object.create(Object.prototype, {

    PRE_CREATE: {
        value: 'storage.pre.create',
        writable: false
    },

    POST_CREATE: {
        value: 'storage.post.create',
        writable: false
    },

    PRE_UPDATE: {
        value: 'storage.pre.update',
        writable: false
    },

    POST_UPDATE: {
        value: 'storage.post.update',
        writable: false
    },

    PRE_REMOVE: {
        value: 'storage.pre.remove',
        writable: false
    },

    POST_REMOVE: {
        value: 'storage.post.remove',
        writable: false
    },

    /**
     * Return the alias of the entity being committed
     *
     * @return {String}
     */

    getAlias: {
        value: function () {
            return this.alias;
        }
    },

    /**
     * Return the entity being committed
     *
     * @return {Sy.EntityInterface}
     */

    getEntity: {
        value: function () {
            return this.entity;
        }
    },

    /**
     * Abort the commit to the database for this entity
     *
     * @return {Sy.Storage.LifeCycleEvent} self
     */

    abort: {
        value: function () {
            this.aborted = true;

            return this;
        }
    },

    /**
     * Check if the commit needs to be aborted
     *
     * @return {Boolean}
     */

    isAborted: {
        value: function () {
            return this.aborted;
        }
    }

});
