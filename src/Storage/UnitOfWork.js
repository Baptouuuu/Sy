namespace('Sy.Storage');

/**
 * Bridge between database driver and entity level
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.UnitOfWork = function () {
    this.driver = null;
    this.map = null;
    this.entities = null;
};
Sy.Storage.UnitOfWork.prototype = Object.create(Object.prototype, {

    /**
     * Set the database driver
     *
     * @param {Sy.Storage.Dbal.DriverInterface} driver
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setDriver: {
        value: function (driver) {
            if (!(driver instanceof Sy.Storage.Dbal.DriverInterface)) {
                throw new TypeError('Invalid database driver');
            }

            this.driver = driver;

            return this;
        }
    },

    /**
     * Set the identity map
     *
     * @param {Sy.Storage.IdentityMap} map
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setIdentityMap: {
        value: function (map) {
            if (!(map instanceof Sy.Storage.IdentityMap)) {
                throw new TypeError('Invalid identity map');
            }

            this.map = map;

            return this;
        }
    },

    /**
     * Return the identity map
     *
     * @return {Sy.Storage.IdentityMap}
     */

    getIdentityMap: {
        value: function () {
            return this.map;
        }
    },

    /**
     * Set a state registry to hold loaded entities
     *
     * @param {Sy.StateRegistryInterface} registry
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setEntitiesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.StateRegistryInterface)) {
                throw new TypeError('Invalid state registry');
            }

            this.entities = registry;

            return this;
        }
    },

    /**
     * Find an entity for the specified id
     *
     * @param {String} alias
     * @param {String} id
     *
     * @return {Promise}
     */

    find: {
        value: function (alias, id) {
            if (this.entities.has(alias, id)) {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve(this.entities.get(alias, id));
                    }.bind(this), 0);
                }.bind(this));
            }

            return this.driver
                .read(alias, id)
                .then(function (data) {
                    return this.buildEntity(alias, data);
                }.bind(this));
        }
    },

    /**
     * Find all the entities for the given alias
     *
     * @param {String} alias
     *
     * @return {Promise}
     */

    findAll: {
        value: function (alias) {
            return this.driver
                .findAll(alias)
                .then(function (data) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        data[i] = this.buildEntity(alias, data[i]);
                    }

                    return data;
                }.bind(this));
        }
    },

    /**
     * Find entities matching the given alias and criteria
     *
     * @param {String} alias
     * @param {String} index
     * @param {mixed} value
     * @param {Integer} limit
     *
     * @return {Promise}
     */

    findBy: {
        value: function (alias, index, value, limit) {
            return this.driver
                .findBy(alias, index, value, limit)
                .then(function (data) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        data[i] = this.buildEntity(alias, data[i]);
                    }

                    return data;
                }.bind(this));
        }
    },

    /**
     * Build an entity for the specified alias
     *
     * @param {String} alias
     * @param {Object} data
     *
     * @return {Sy.EntityInterface}
     */

    buildEntity: {
        value: function (alias, data) {
            var constructor = this.map.getConstructor(alias),
                key = this.map.getKey(alias),
                entity;

            if (this.entities.has(alias, data[key])) {
                entity = this.entities.get(alias, data[key]);
            } else {
                entity = new constructor();
                this.entities.set(alias, data[key], entity);
            }

            for (var p in data) {
                if (data.hasOwnProperty(p)) {
                    entity.set(p, data[p]);
                }
            }

            return entity;
        }
    },

    /**
     * Plan the given entity to be persisted
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    persist: {
        value: function (entity) {}
    },

    /**
     * Commit the changes to the database
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    commit: {
        value: function () {}
    },

    /**
     * Plan the entity to be removed from the database
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    remove: {
        value: function (entity) {}
    },

    /**
     * Detach all entities or the ones of the given alias
     *
     * @param {String} alias optional
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    clear: {
        value: function (alias) {}
    },

    /**
     * Detach the given entity
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    detach: {
        value: function (entity) {}
    },

    /**
     * Check if the entity is managed
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isManaged: {
        value: function (entity) {}
    }

});
