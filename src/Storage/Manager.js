namespace('Sy.Storage');

/**
 * Entity manager
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.Manager = function () {
    this.driver = null;
    this.uow = null;
    this.mappings = null;
    this.repoFactory = null;
};
Sy.Storage.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set the database driver
     *
     * @param {Sy.Storage.Dbal.DriverInterface} driver
     *
     * @return {Sy.Storage.Manager} self
     */

    setDriver: {
        value: function (driver) {
            if (!(driver instanceof Sy.Storage.Dbal.DriverInterface)) {
                throw new TypeError('Invalid dbal driver');
            }

            this.driver = driver;

            return this;
        }
    },

    /**
     * Return the driver
     *
     * @return {Sy.Storage.Dbal.DriverInterface}
     */

    getDriver: {
        value: function () {
            return this.driver;
        }
    },

    /**
     * Set the unit of work
     *
     * @param {Sy.Storage.UnitOfWork} uow
     *
     * @return {Sy.Storage.Manager} self
     */

    setUnitOfWork: {
        value: function (uow) {
            if (!(uow instanceof Sy.Storage.UnitOfWork)) {
                throw new TypeError('Invalid unit of work');
            }

            this.uow = uow;

            return this;
        }
    },

    /**
     * Set the allowed entities to be managed here
     *
     * @param {Array} mappings
     *
     * @return {Sy.Storage.Manager} self
     */

    setMappings: {
        value: function (mappings) {
            this.mappings = mappings;

            return this;
        }
    },

    /**
     * Set the repository factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     *
     * @return {Sy.Storage.Manager} self
     */

    setRepositoryFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }
            this.repoFactory = factory;

            return this;
        }
    },

    /**
     * Find an entity by its id
     *
     * @param {String} alias Entity name alias (ie: 'Bundle::Entity')
     * @param {String} id
     *
     * @return {Promise}
     */

    find: {
        value: function (alias, id) {
            if (!this.isHandled(alias)) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            return this.uow.find(alias, id);
        }
    },

    /**
     * Plan an entity to be persisted to the database
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.Manager} self
     */

    persist: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap.getKey(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            this.uow.persist(entity);

            return this;
        }
    },

    /**
     * Commit the changes to the database
     *
     * @return {Sy.Storage.Manager} self
     */

    flush: {
        value: function () {
            this.uow.commit();

            return this;
        }
    },

    /**
     * Plan an entity to be removed from the database
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.Manager} self
     */

    remove: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap.getKey(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            this.uow.remove(entity);

            return this;
        }
    },

    /**
     * Detach all the entities managed
     *
     * @param {String} alias Entity alias, optional
     *
     * @return {Sy.Storage.Manager} self
     */

    clear: {
        value: function (alias) {
            this.uow.clear(alias);

            return this;
        }
    },

    /**
     * Detach an entity from the manager,
     * any changes to the entity will not be persisted
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.Manager} self
     */

    detach: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap.getKey(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            this.uow.detach(entity);

            return this;
        }
    },

    /**
     * Get the repository for the given alias
     *
     * @param {String} alias
     *
     * @return {Sy.Storage.Repository}
     */

    getRepository: {
        value: function (alias) {
            if (!this.isHandled(alias)) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            return this.repoFactory.make(this, alias);
        }
    },

    /**
     * Tell if the entity is managed by this manager
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    contains: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap.getKey(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            return this.uow.isManaged(entity);
        }
    },

    /**
     * Return the UnitOfWork
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    getUnitOfWork: {
        value: function () {
            return this.uow;
        }
    },

    /**
     * Check if the alias is managed by this manager
     *
     * @private
     * @param {String} alias
     *
     * @return {Boolean}
     */

    isHandled: {
        value: function (alias) {
            if (this.mappings.length === 0) {
                return true;
            }

            return this.mappings.indexOf(alias) !== -1;
        }
    }

});
