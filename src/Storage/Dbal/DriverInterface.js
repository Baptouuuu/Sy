namespace('Sy.Storage.Dbal');

/**
 * Minimum signature a driver must implement
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 */

Sy.Storage.Dbal.DriverInterface = function () {};
Sy.Storage.Dbal.DriverInterface.prototype = Object.create(Object.prototype, {

    /**
     * Retrieve an object by its id
     *
     * @param {String} store
     * @param {String} id
     *
     * @return {Promise}
     */

    read: {
        value: function (store, id) {}
    },

    /**
     * Create a new element in the store
     *
     * @param {String} store
     * @param {Object} object
     *
     * @return {Promise}
     */

    create: {
        value: function (store, object) {}
    },

    /**
     * Update an object in the store
     *
     * @param {String} store
     * @param {String} id
     * @param {Object} object
     *
     * @return {Promise}
     */

    update: {
        value: function (store, id, object) {}
    },

    /**
     * Delete an object from the store
     *
     * @param {String} store
     * @param {String} id
     *
     * @return {Promise}
     */

    remove: {
        value: function (store, id) {}
    },

    /**
     * Find (an) element(s) in the storage
     *
     * @param {String} store
     * @param {String} index
     * @param {Mixed} value
     * @param {Integer} limit Optional
     *
     * @return {Promise}
     */

    find: {
        value: function (store, index, value, limit) {}
    },

    /**
     * Retrieve all the objects from a store
     *
     * @param {String} store
     *
     * @return {Promise}
     */

    findAll: {
        value: function (store) {}
    }

});
