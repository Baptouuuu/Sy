namespace('Sy.ServiceContainer');

/**
 * Service container
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Core = function () {

};

Sy.ServiceContainer.Core.prototype = Object.create(Object.prototype, {

    /**
     * Add a set of services definitions to the container
     *
     * @param {Object} services
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    set: {
        value: function (services) {

        }
    },

    /**
     * Return the instance of a defined service
     *
     * @param {String} id
     *
     * @throws {ReferenceError} If the service has not been defined or is private
     *
     * @return {Object}
     */

    get: {
        value: function (id) {

        }
    },

    /**
     * Check if a service is defined
     *
     * @param {String} id
     *
     * @return {Boolean}
     */

    has: {
        value: function (id) {

        }
    },

    /**
     * Check if a service has been initialized
     *
     * @param {String} id
     *
     * @return {Boolean}
     */

    initialized: {
        value: function (id) {

        }
    },

    /**
     * Set an config object
     *
     * @param {Sy.ConfiguratorInterface} config
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    setParameters: {
        value: function (config) {

        }
    },

    /**
     * Return a parameter
     *
     * @param {String} path
     *
     * @throws {ReferenceError} If the path is not accessible
     *
     * @return {mixed}
     */

    getParameter: {
        value: function (path) {

        }
    },

    /**
     * Check if a parameter is defined
     *
     * @param {String} path
     *
     * @return {Boolean}
     */

    hasParameter: {
        value: function (path) {

        }
    },

    /**
     * Return the definition of a service
     *
     * @param {String} id
     *
     * @throws {ReferenceError} If the service does not exist or the container has been compiled
     *
     * @return {Sy.ServiceContainer.Definition}
     */

    getDefinition: {
        value: function (id) {

        }
    },

    /**
     * Add a compiler pass
     *
     * @param {String} event
     * @param {Sy.ServiceContainer.CompilerPassInterface} pass
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    addPass: {
        value: function (event, pass) {

        }
    },

    /**
     * Compile the container
     */

    compile: {
        value: function () {

        }
    },

    /**
     * Return the service ids flagged with the specified tag
     *
     * @param {String} tag
     *
     * @return {Array}
     */

    findTaggedServiceIds: {
        value: function (tag) {

        }
    }

});
