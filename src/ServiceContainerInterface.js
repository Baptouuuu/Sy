namespace('Sy');

/**
 * Interface for all service container objects
 *
 * @package Sy
 * @interface
 */

Sy.ServiceContainerInterface = function () {};
Sy.ServiceContainerInterface.prototype = Object.create(Object.prototype, {

    /**
     * Inject the parameters object from the global config
     *
     * @param {Object} params
     *
     * @return {Sy.ServiceContainerInterface}
     */

    setParameters: {
        value: function (params) {}
    },

    /**
     * Return the parameter value based on its path string
     *
     * @param {string} path
     *
     * @return {mixed}
     */

    getParameter: {
        value: function (path) {}
    },

    /**
     * Container name setter
     *
     * @param {string} name
     *
     * @return {Sy.ServiceContainerInterface}
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Container name getter
     *
     * @return {string}
     */

    getName: {
        value: function () {}
    },

    /**
     * Set a new service inside the container
     *
     * @param {string} name Name of the service (must follow the pattern: "/(\w+::)|(\w+)/i")
     * @param {function} constructor Function that must return the object that will act as a service
     * @param {Array} tags List of objects defining tags
     *
     * @return {Sy.ServiceContainerInterface}
     */

    set: {
        value: function (name, constructor, tags) {}
    },

    /**
     * Retrieve a service via its key
     *
     * @param {string} name
     *
     * @return {object}
     */

    get: {
        value: function (name) {}
    },

    /**
     * Check if a service exist in the container
     *
     * @param {string} name
     *
     * @return {boolean}
     */

    has: {
        value: function (name) {}
    },

    /**
     * Return the list of services that match a tag name
     *
     * @param {String} tag Tag name
     *
     * @return {Array}
     */

    filter: {
        value: function (tag) {}
    },

    /**
     * Return the array of tags defined for a service
     *
     * @param {String} service Service name
     *
     * @return {Array}
     */

    getTags: {
        value: function (service) {}
    }

});