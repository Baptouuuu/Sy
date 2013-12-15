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
     * Retrieve an item by its identifier
     *
     * @param {string} identifier
     * @param {function} callback Called when the item is retrieved with the whole object as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    read: {
        value: function (identifier, callback) {}
    },

    /**
     * Create a new element
     *
     * @param {object} object
     * @param {function} callback Called when the item is created with it's id as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    create: {
        value: function (object, callback) {}
    },

    /**
     * Update an element in the storage
     *
     * @param {string} identifier Object identifier
     * @param {object} object
     * @param {function} callback Called when the item is updated with the whole object as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    update: {
        value: function (identifier, object, callback) {}
    },

    /**
     * Remove an element from the storage
     *
     * @param {string} identifier
     * @param {function} callback Called when the item is deleted with the id as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    remove: {
        value: function (identifier, callback) {}
    },

    /**
     * Find (an) element(s) in the storage
     *
     * @param {object} args Available properties: index, value, limit, callback
     *
     * @return {Sy.Storage.EngineInterface}
     */

    find: {
        value: function (args) {}
    }

});