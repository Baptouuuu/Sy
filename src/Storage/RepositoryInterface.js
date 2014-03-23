namespace('Sy.Storage');

/**
 * Interface showing how a repository must handle entities
 * Each Entity Repository must implement this interface
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 */

Sy.Storage.RepositoryInterface = function () {};

Sy.Storage.RepositoryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a unit of work to handle modifications of entities
     *
     * @param {Sy.Storage.UnitOfWork} uow
     *
     * @return {Sy.Storage.Repository}
     */

    setUnitOfWork: {
        value: function (uow) {}
    },

    /**
     * Set the alias name of entities handled by the repository
     *
     * @param {string} name
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Set the storage engine
     *
     * @param {Sy.Storage.EngineInterface} engine
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setEngine: {
        value: function (engine) {}
    },

    /**
     * Set the entity property acting as identifier
     *
     * @param {string} key
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setEntityKey: {
        value: function (key) {}
    },

    /**
     * Set the constructor for the handled entity
     *
     * @param {Sy.EntityInterface} constructor Entity constructor
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setEntityConstructor: {
        value: function (constructor) {}
    },

    /**
     * Set the indexes of the entity
     *
     * @param {Array} indexes
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setIndexes: {
        value: function (indexes) {}
    },

    /**
     * Set the identifier generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setGenerator: {
        value: function (generator) {}
    },

    /**
     * Persist a new entity
     *
     * If trying to persist an entity not handled by the repo, raise a TypeError
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    persist: {
        value: function (entity) {}
    },

    /**
     * Remove an entity
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    remove: {
        value: function (entity) {}
    },

    /**
     * Apply the changes to the storage (create/update/delete)
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    flush: {
        value: function () {}
    },

    /**
     * Find one entity in the storage
     * Only indexes can be searchable
     *
     * @param {object} args Allowed properties: index, value, callback
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    findOneBy: {
        value: function (args) {}
    },

    /**
     * Find a set of entities in the storage
     * Only indexes can be searchable
     *
     * @param {object} args Allowed properties: index, value, callback
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    findBy: {
        value: function (args) {}
    }

});