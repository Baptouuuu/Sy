namespace('Sy');

/**
 * Entity stack interface to ease managing entities in the app
 * and to abstract data retrieval from storage
 *
 * @package Sy
 * @interface
 */

Sy.StackInterface = function () {

};

Sy.StackInterface.prototype = Object.create(Object.prototype, {

    /**
     * Stack name setter
     *
     * @param {string} name
     *
     * @return {Sy.StackInterface}
     */

    setName: {
        value: function (name) {

            return this;

        }
    },

    /**
     * Retrieve all entities from the storage
     *
     * @return {Sy.StackInterface}
     */

    retrieve: {
        value: function () {

            return this;

        }
    },

    /**
     * Retrieve an entity already loaded in the stack
     *
     * @param {string} key Unique identifier
     *
     * @return {Sy.EntityInterface}
     */

    get: {
        value: function (key) {}
    },

    /**
     * Retrieve all entities loaded in the stack
     *
     * @return {Array}
     */

    getAll: {
        value: function () {}
    },

    /**
     * Push an entity into the stack, if entity previously pushed it will update it
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.StackInterface}
     */

    persist: {
        value: function (entity) {

            return this;

        }
    },

    /**
     * Remove an entity from the stack
     *
     * @param {string} key Unique identifier
     *
     * @return {Sy.EntityInterface}
     */

    remove: {
        value: function (key) {

            return this;

        }
    },

    /**
     * Remove all entities from the stack
     *
     * @return {Sy.StackInterface}
     */

    clear: {
        value: function () {

            return this;

        }
    },

    /**
     * Apply modifications (create/update/remove) of the stack to the storage
     *
     * @return {Sy.StackInterface}
     */

    flush: {
        value: function () {

            return this;

        }
    },

    /**
     * Check if the stack contains an entity through its key
     *
     * @param {string} key
     *
     * @return {boolean}
     */

    contains: {
        value: function (key) {}
    }

});