namespace('Sy');

/**
 * Class used to reverse dependencies in the service container
 *
 * @package Sy
 * @class
 */

Sy.ParamProxy = function () {
    this.parameters = null;
    this.serviceContainer = null;
};
Sy.ParamProxy.prototype = Object.create(Object.prototype, {

    /**
     * Set the parameter object
     *
     * @param {Object} parameters
     *
     * @return {Sy.ParamProxy}
     */

    setParameters: {
        value: function (parameters) {

            this.parameters = parameters;

            return this;

        }
    },

    /**
     * Set the service container it depends on
     *
     * @param {Sy.ServiceContainerInterface} serviceContainer
     *
     * @return {Sy.ParamProxy}
     */

    setServiceContainer: {
        value: function (serviceContainer) {

            if (!(serviceContainer instanceof Sy.ServiceContainerInterface)) {
                throw new TypeError('Invalid service container');
            }

            this.serviceContainer = serviceContainer;

            return this;

        }
    },

    /**
     * Check if the value is a parameter dependency
     *
     * @param {String} value
     *
     * @return {Boolean}
     */

    isParameter: {
        value: function (value) {

            if (typeof value === 'string' && new RegExp(/^%.*%$/i).test(value)) {
                return true;
            }

            return false;

        }
    },

    /**
     * Get the parameter dependency
     *
     * @param {String} path Object path string (ie: '%object.path%')
     *
     * @return {Boolean}
     */

    getParameter: {
        value: function (path) {

            path = path.substring(1, path.length - 1);

            return objectGetter.call(this.parameters, path);

        }
    },

    /**
     * Check if the value is a service dependency
     *
     * @param {String} value
     *
     * @return {Boolean}
     */

    isService: {
        value: function (value) {

            if (typeof value === 'string' && value.substring(0, 1) === '@') {
                return true;
            }

            return false;

        }
    },

    /**
     * Get the service dependency
     *
     * @param {String} name ie: '@service::name'
     *
     * @return {Object}
     */

    getService: {
        value: function (name) {

            name = name.substring(1);

            return this.serviceContainer.get(name);

        }
    },

    /**
     * Check wether the value is a dependency or not
     *
     * @param {mixed} value
     *
     * @return {Boolean}
     */

    isDependency: {
        value: function (value) {

            if (this.isParameter(value) || this.isService(value)) {
                return true;
            }

            return false;

        }
    },

    /**
     * Get the dependecy
     *
     * @param {String} name
     *
     * @return {mixed}
     */

    getDependency: {
        value: function (name) {

            if (this.isParameter(name)) {
                return this.getParameter(name);
            } else if (this.isService(name)) {
                return this.getService(name);
            }

            return name;

        }
    }

});
