namespace('Sy.Storage');

/**
 * Entity repository
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @param {Sy.Storage.Manager} em
 * @param {String} alias
 */

Sy.Storage.Repository = function (em, alias) {
    if (!(em instanceof Sy.Storage.Manager)) {
        throw new TypeError('Invalid entity manager');
    }

    this.em = em;
    this.alias = alias;
};
Sy.Storage.Repository.prototype = Object.create(Object.prototype, {

    /**
     * Detach all the entities for this entity type
     *
     * @return {Sy.Storage.Repository} self
     */

    clear: {
        value: function () {
            this.em.clear(this.alias);

            return this;
        }
    },

    /**
     * Find an entity by its id
     *
     * @param {String} id
     *
     * @return {Promise}
     */

    find: {
        value: function (id) {
            return this.em.find(this.alias, id);
        }
    },

    /**
     * Find all entities
     *
     * @return {Promise}
     */

    findAll: {
        value: function () {
            return this.em
                .getUnitOfWork()
                .findAll(this.alias);
        }
    },

    /**
     * Find all entities matching the criteria
     *
     * @param {String} index
     * @param {mixed} value Value or array of bounds
     * @param {Integer} limit optional
     *
     * @return {Promise}
     */

    findBy: {
        value: function (index, value, limit) {
            return this.em
                .getUnitOfWork()
                .findBy(this.alias, index, value, limit);
        }
    },

    /**
     * Find one entity matching the criteria
     *
     * @param {String} index
     * @param {mixed} value Value or array of bounds
     *
     * @return {Promise}
     */

    findOneBy: {
        value: function (index, value) {
            return this.em
                .getUnitOfWork()
                .findBy(this.alias, index, value, 1)
                .then(function (entities) {
                    if (entities.length === 1) {
                        return entities[0];
                    }

                    throw new ReferenceError('Entity not found');
                });
        }
    }

});
