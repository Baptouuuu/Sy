namespace('Sy.ServiceContainer');

/**
 * Service definition
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Definition = function () {
    this.constructor = null;
    this.factoryService = null;
    this.factoryMethod = null;
    this.configuratorService = null;
    this.configuratorMethod = null;
    this.calls = [];
    this.public = true;
    this.tags = [];
    this.abstract = false;
    this.parent = null;
    this.proto = false;
};

Sy.ServiceContainer.Definition.prototype = Object.create(Object.prototype, {

    /**
     * Set the path to the service constructor
     *
     * @param {String} path
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setConstructor: {
        value: function (constructor) {
            this.constructor = constructor;

            return this;
        }
    },

    /**
     * Return the constructor path
     *
     * @return {String}
     */

    getConstructor: {
        value: function () {
            return this.constructor;
        }
    },

    /**
     * Set the factory service reference
     *
     * @param {Sy.ServiceContainer.Reference} reference
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setFactoryService: {
        value: function (reference) {
            if (!(reference instanceof Sy.ServiceContainer.Reference)) {
                throw new TypeError('Invalid reference');
            }

            this.factoryService = reference;

            return this;
        }
    },

    /**
     * Return the factory service reference
     *
     * @return {Sy.ServiceContainer.Reference}
     */

    getFactoryService: {
        value: function () {
            return this.factoryService;
        }
    },

    /**
     * Set the factory method
     *
     * @param {String} method
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setFactoryMethod: {
        value: function (method) {
            this.factoryMethod = method;

            return this;
        }
    },

    /**
     * Return the factory method
     *
     * @return {String}
     */

    getFactoryMethod: {
        value: function () {
            return this.factoryMethod;
        }
    },

    /**
     * Check if a factory is defined
     *
     * @return {Boolean}
     */

    hasFactory: {
        value: function () {
            return !!this.factoryService && !!this.factoryMethod;
        }
    },

    /**
     * Set the configurator reference
     *
     * @param {Sy.ServiceContainer.Reference} configurator
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setConfigurator: {
        value: function (configurator) {
            if (!(configurator instanceof Sy.ServiceContainer.Reference)) {
                throw new TypeError('Invalid reference');
            }

            this.configuratorService = configurator;

            return this;
        }
    },

    /**
     * Return the configurator reference
     *
     * @return {Sy.ServiceContainer.Reference}
     */

    getConfigurator: {
        value: function () {
            return this.configuratorService;
        }
    },

    /**
     * Set configurator method
     *
     * @param {String} method
     *
     * @return {Sy.ServiceConfigurator.Definition} self
     */

    setConfiguratorMethod: {
        value: function (method) {
            this.configuratorMethod = method;

            return this;
        }
    },

    /**
     * Return configurator method
     *
     * @return {String}
     */

    getConfiguratorMethod: {
        value: function () {
            return this.configuratorMethod;
        }
    },

    /**
     * Check if service has a configurator
     *
     * @return {Boolean}
     */

    hasConfigurator: {
        value: function () {
            return !!this.configuratorService && !!this.configuratorMethod;
        }
    },

    /**
     * Add a new call statement
     *
     * @param {String} method
     * @param {Array} args Array of arguments
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    addCall: {
        value: function (method, args) {
            this.calls.push([method, args]);

            return this;
        }
    },

    /**
     * Return the list of calls
     *
     * @return {Array}
     */

    getCalls: {
        value: function () {
            return this.calls;
        }
    },

    /**
     * Set the service as private
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setPrivate: {
        value: function () {
            this.public = false;

            return this;
        }
    },

    /**
     * Check if the service is public
     *
     * @return {Boolean}
     */

    isPublic: {
        value: function () {
            return this.public;
        }
    },

    /**
     * Add a tag
     *
     * @param {String} name
     * @param {Object} data
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    addTag: {
        value: function (name, data) {
            data = data || {};
            this.tags.push([name, data]);

            return this;
        }
    },

    /**
     * Return the list of tags
     *
     * @return {Array}
     */

    getTags: {
        value: function () {
            return this.tags;
        }
    },

    /**
     * Return the list of tags matching the name
     *
     * @param {String} name
     *
     * @return {Array}
     */

    getTag: {
        value: function (name) {
            return this.tags.filter(function (el) {
                return el[0] === name;
            }, this);
        }
    },

    /**
     * Set the service as abstract
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setAbstract: {
        value: function () {
            this.abstract = true;

            return this;
        }
    },

    /**
     * Check if the service is abstract
     *
     * @return {Boolean}
     */

    isAbstract: {
        value: function () {
            return this.abstract;
        }
    },

    /**
     * Set a service reference as parent
     *
     * @param {Sy.ServiceContainer.Reference} parent
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setParent: {
        value: function (parent) {
            if (!(parent instanceof Sy.ServiceContainer.Reference)) {
                throw new TypeError('Invalid reference');
            }

            this.parent = parent;

            return this;
        }
    },

    /**
     * Check if the service has a parent
     *
     * @return {Boolean}
     */

    hasParent: {
        value: function () {
            return !!this.parent;
        }
    },

    /**
     * Return the parent reference
     *
     * @return {Sy.ServiceContainer.Reference}
     */

    getParent: {
        value: function () {
            return this.parent;
        }
    },

    /**
     * Set the service as prototype, meaning a new one
     * is built each time the service is accessed
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setPrototype: {
        value: function () {
            this.proto = true;

            return this;
        }
    },

    /**
     * Check if the service is a prototype
     *
     * @return {Boolean}
     */

    isPrototype: {
        value: function () {
            return this.proto;
        }
    }

});
