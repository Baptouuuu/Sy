namespace('Sy.Storage');

/**
 * Hold the relation between an alias and an entity constructor
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.IdentityMap = function () {
    this.aliases = [];
    this.constructors = [];
    this.prototypes = [];
    this.keys = [];
};
Sy.Storage.IdentityMap.prototype = Object.create(Object.prototype, {

    /**
     * Set a new entity definition
     *
     * @param {String} alias
     * @param {Function} entity
     * @param {String} key
     *
     * @return {Sy.Storage.IdentityMap} self
     */

    set: {
        value: function (alias, entity, key) {
            if (Object.isFrozen(this.aliases)) {
                return this;
            }

            this.aliases.push(alias);
            this.constructors.push(entity);
            this.prototypes.push(entity.prototype);
            this.keys.push(key);

            return this;
        }
    },

    /**
     * Lock the definitions so indexes are preserved (no addition nor removal)
     *
     * @return {Sy.Storage.IdentityMap} self
     */

    lock: {
        value: function () {
            Object.freeze(this.aliases);
            Object.freeze(this.constructors);
            Object.freeze(this.prototypes);
            Object.freeze(this.keys);

            return this;
        }
    },

    /**
     * Check if the given alias is defined
     *
     * @param {String} alias
     *
     * @return {Boolean}
     */

    hasAlias: {
        value: function (alias) {
            return this.aliases.indexOf(alias) !== -1;
        }
    },

    /**
     * Check if the given entity is defined
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    hasEntity: {
        value: function (entity) {
            var refl = new ReflectionObject(entity);

            return this.prototypes.indexOf(refl.getPrototype()) !== -1;
        }
    },

    /**
     * Return the alias for the given entity
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {String}
     */

    getAlias: {
        value: function (entity) {
            var refl = new ReflectionObject(entity),
                idx = this.prototypes.indexOf(refl.getPrototype());

            return this.aliases[idx];
        }
    },

    /**
     * Return the entity constructor for the given alias
     *
     * @param {String} alias
     *
     * @return {Sy.EntityInterface}
     */

    getConstructor: {
        value: function (alias) {
            var idx = this.aliases.indexOf(alias);

            return this.constructors[idx];
        }
    },

    /**
     * Return the key for the specified alias
     *
     * @param {String} alias
     *
     * @return {String}
     */

    getKey: {
        value: function (alias) {
            var idx = this.aliases.indexOf(alias);

            return this.keys[idx];
        }
    }

});
