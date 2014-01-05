namespace('Sy');

/**
 * Entity interface
 *
 * @package Sy
 * @interface
 */

Sy.EntityInterface = function () {

};

Sy.EntityInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set an attribute value to the entity
     *
     * @param {string} attr
     * @param {mixed} value
     *
     * @return {Sy.EntityInterface}
     */

    set: {
        value: function (attr, value) {

            return this;

        }
    },

    /**
     * Return an attribute value
     *
     * @param {string} attr
     *
     * @return {mixed}
     */

    get: {
        value: function (attr) {}
    },

    /**
     * Register an attribute as index or as a connection to another entity
     *
     * @param {string} attr
     * @param {string} entity If set it will link the attribute to another entity, this param must follow this pattern: \w+::\w+
     *
     * @return {Sy.EntityInterface}
     */

    register: {
        value: function (attr, entity) {}
    },

    /**
     * Block the available attributes for this entity. Once set, the list won't be mutable.
     *
     * @param {Array} attributes
     *
     * @return {Sy.EntityInterface}
     */

    lock: {
        value: function (attributes) {}
    },

    /**
     * Return a POJO, connection attributes will return the uuid of entities;
     * dates will be formalized via the toJSON method.
     *
     * @return {object}
     */

    getRaw: {
        value: function () {}
    }

});