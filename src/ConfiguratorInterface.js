namespace('Sy');

/**
 * Wrapper to set/retrieve key/value pairs
 *
 * @package Sy
 * @interface
 */

Sy.ConfiguratorInterface = function () {

    this.name = '';

};

Sy.ConfiguratorInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a new key/value pair
     *
     * @param {string} key
     * @param {mixed} value
     *
     * @return {Sy.ConfiguratorInterface}
     */

    set: {
        value: function (key, value) {

            return this;

        }
    },

    /**
     * Return a previously set value through its key
     *
     * @param {string} key
     *
     * @return {mixed}
     */

    get: {
        value: function (key) {

            return value;

        }
    },

    /**
     * Check if a key is set in the configuration
     *
     * @param {string} key
     *
     * @return {boolean}
     */

    has: {
        value: function (key) {}
    },

    /**
     * Set a name for configuration object
     *
     * @param {string} name
     *
     * @return {Sy.ConfiguratorInterface}
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    /**
     * Return the configuration name
     *
     * @return {string}
     */

    getName: {
        value: function () {

            return this.name;

        }
    }

});