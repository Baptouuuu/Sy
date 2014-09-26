namespace('Sy.Storage');

/**
 * Entry point to the storage mechanism
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.Core = function () {
    this.managers = null;
    this.defaultName = 'default';
    this.factory = null;
};
Sy.Storage.Core.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold managers
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.Core} self
     */

    setManagersRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.managers = registry;

            return this;
        }
    },

    /**
     * Set the default manager name
     *
     * @param {String} defaultName
     *
     * @return {Sy.Storage.Core} self
     */

    setDefaultManager: {
        value: function (defaultName) {
            this.defaultName = defaultName || 'default';

            return this;
        }
    },

    /**
     * Set the manager factory
     *
     * @param {Sy.Storage.ManagerFactory} factory
     *
     * @return {Sy.Storage.Core} self
     */

    setManagerFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.ManagerFactory)) {
                throw new TypeError('Invalid manager factory');
            }

            this.factory = factory;

            return this;
        }
    },

    /**
     * Get an entity manager
     *
     * @param {String} name Manager name, optional
     *
     * @return {Sy.Storage.Manager}
     */

    getManager: {
        value: function (name) {
            name = name || this.defaultName;

            if (this.managers.has(name)) {
                return this.managers.get(name);
            }

            var manager = this.factory.make(name);

            this.managers.set(name, manager);

            return manager;
        }
    }

});
