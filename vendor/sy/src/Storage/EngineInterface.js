namespace('Sy.Storage');

/**
 * Interface explaining how the engines must work
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 * @param {mixed} meta Informations about the engine
 */

Sy.Storage.EngineInterface = function (meta) {};

Sy.Storage.EngineInterface.prototype = Object.create(Object.prototype, {

    /**
     * Add a new store in the engine (where objects will be putted)
     *
     * @param {string} alias Callable store
     * @param {string} name Actual name used to construct the store
     * @param {string} identifier Property used as identifier
     * @param {Array} indexes
     *
     * @return {Sy.Storage.EngineInterface}
     */

    setStore: {
        value: function (alias, name, identifier, indexes) {}
    },

    /**
     * Retrieve an item by its identifier
     *
     * @param {string} store Alias name of the store
     * @param {string} identifier
     * @param {function} callback Called when the item is retrieved with the whole object as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    read: {
        value: function (store, identifier, callback) {}
    },

    /**
     * Create a new element
     *
     * @param {string} store Alias name of the store
     * @param {object} object
     * @param {function} callback Called when the item is created with it's id as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    create: {
        value: function (store, object, callback) {}
    },

    /**
     * Update an element in the storage
     *
     * @param {string} store Alias name of the store
     * @param {string} identifier Object identifier
     * @param {object} object
     * @param {function} callback Called when the item is updated with the whole object as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    update: {
        value: function (store, identifier, object, callback) {}
    },

    /**
     * Remove an element from the storage
     *
     * @param {string} store Alias name of the store
     * @param {string} identifier
     * @param {function} callback Called when the item is deleted with the id as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    remove: {
        value: function (store, identifier, callback) {}
    },

    /**
     * Find (an) element(s) in the storage
     *
     * @param {string} store Alias name of the store
     * @param {object} args Available properties: index, value, limit, callback
     *
     * @return {Sy.Storage.EngineInterface}
     */

    find: {
        value: function (store, args) {}
    }

});