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
    this.states = null;
    this.propertyAccessor = null;
    this.scheduledForInsert = [];
    this.scheduledForUpdate = [];
    this.scheduledForDelete = [];
    this.logger = null;
    this.generator = null;
};
Sy.Storage.UnitOfWork.prototype = Object.create(Object.prototype, {

    STATE_NEW: {
        value: 'new',
        writable: false,
    },

    STATE_MANAGED: {
        value: 'managed',
        writable: false
    },

    STATE_DETACHED: {
        value: 'detached',
        writable: false
    },

    STATE_REMOVED: {
        value: 'removed',
        writable: false
    },

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
     * Set a property accessor
     *
     * @param {Sy.PropertyAccessor} accessor
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setPropertyAccessor: {
        value: function (accessor) {
            if (!(accessor instanceof Sy.PropertyAccessor)) {
                throw new TypeError('Invalid property accessor');
            }

            this.propertyAccessor = accessor;

            return this;
        }
    },

    /**
     * Set a state registry to hold entities states
     *
     * @param {Sy.StateRegistryInterface} registry
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setStatesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.StateRegistryInterface)) {
                throw new TypeError('Invalid state registry');
            }

            this.states = registry;

            return this;
        }
    },

    /**
     * Set a logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setLogger: {
        value: function (logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;
        }
    },

    /**
     * Set a generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setLogger: {
        value: function (generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

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

                (new ObjectObserver(entity))
                    .open(function () {
                        this.computeSchedules(entity);
                    }.bind(this));
            }

            for (var p in data) {
                if (data.hasOwnProperty(p)) {
                    entity.set(p, data[p]);
                }
            }

            this.states.set(this.STATE_MANAGED, data[key], data[key]);

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
        value: function (entity) {
            if (!(entity instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity');
            }

            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                id = this.propertyAccessor.getValue(entity, key),
                state = this.states.state(id);

            this.entities.set(alias, id, entity);

            if (state === undefined) {
                this.states.set(
                    this.STATE_NEW,
                    id,
                    id
                );
                this.scheduledForInsert.push(entity);

                (new ObjectObserver(entity))
                    .open(function () {
                        this.computeSchedules(entity);
                    }.bind(this));
            } else {
                this.scheduledForUpdate.push(entity);
            }

            return this;
        }
    },

    /**
     * Commit the changes to the database
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    commit: {
        value: function () {
            Platform.performMicrotaskCheckpoint();

            this.scheduledForInsert.forEach(function (entity) {
                var alias = this.map.getAlias(entity),
                    key = this.map.getKey(alias),
                    id = this.generator.generate();

                this.propertyAccessor.setValue(entity, key, id);

                this.driver
                    .create(alias, this.getEntityData(entity))
                    .then(function () {
                        this.states.set(
                            this.STATE_MANAGED,
                            id,
                            id
                        );
                    }.bind(this));
            }, this);
            this.scheduledForUpdate.forEach(function (entity) {
                var alias = this.map.getAlias(entity),
                    key = this.map.getKey(alias),
                    id = this.propertyAccessor.getValue(entity, key);

                this.driver.update(
                    alias,
                    id,
                    this.getEntityData(entity)
                );
            }, this);
            this.scheduledForDelete.forEach(function (entity) {
                var alias = this.map.getAlias(entity),
                    key = this.map.getKey(alias),
                    id = this.propertyAccessor.getValue(entity, key);

                this.driver.remove(alias, id);
            }, this);

            //reinitialize schedules so 2 close commits can't trigger
            //an entity to be sent to the driver twice
            this.scheduledForInsert.splice(0);
            this.scheduledForUpdate.splice(0);
            this.scheduledForDelete.splice(0);

            return this;
        }
    },

    /**
     * Plan the entity to be removed from the database
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    remove: {
        value: function (entity) {
            if (!(entity instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity');
            }

            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                state = this.states.state(
                    this.propertyAccessor.getValue(entity, key)
                );

            if (state === this.STATE_MANAGED) {
                if (this.isScheduledForUpdate(entity)) {
                    this.scheduledForUpdate.splice(
                        this.scheduledForUpdate.indexOf(entity),
                        1
                    );
                }

                this.scheduledForDelete.push(entity);
            } else if (state === this.STATE_NEW) {
                this.scheduledForInsert.splice(
                    this.scheduledForInsert.indexOf(entity),
                    1
                );
            }

            return this;
        }
    },

    /**
     * Detach all entities or the ones of the given alias
     *
     * @param {String} alias optional
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    clear: {
        value: function (alias) {
            var entities = this.entities.get(),
                constructor;

            for (var i = 0, l = entities.length; i < l; i++) {
                if (alias !== undefined) {
                    constructor = this.map.getConstructor(alias);

                    if (!(entity instanceof constructor)) {
                        continue;
                    }
                }

                this.detach(entity)
            }

            return this;
        }
    },

    /**
     * Detach the given entity
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    detach: {
        value: function (entity) {
            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                id = this.propertyAccessor.getValue(entity, key);

            this.states.set(this.STATE_DETACHED, id, id);

            if (this.isScheduledForInsert(entity)) {
                this.scheduledForInsert.splice(
                    this.scheduledForInsert.indexOf(entity),
                    1
                );
            }

            if (this.isScheduledForUpdate(entity)) {
                this.scheduledForUpdate.splice(
                    this.scheduledForUpdate.indexOf(entity),
                    1
                );
            }

            if (this.isScheduledForDelete(entity)) {
                this.scheduledForDelete.splice(
                    this.scheduledForDelete.indexOf(entity),
                    1
                );
            }

            return this;
        }
    },

    /**
     * Check if the entity is managed
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isManaged: {
        value: function (entity) {
            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                id = this.propertyAccessor.getValue(entity, key);
                state = this.states.state(id);

            return [this.STATE_NEW, this.STATE_MANAGED].indexOf(state) !== -1;
        }
    },

    /**
     * Check if the entity is scheduled for insertion
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForInsert: {
        value: function (entity) {
            return this.scheduledForInsert.indexOf(entity) !== -1;
        }
    },

    /**
     * Check if the entity is scheduled for update
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForUpdate: {
        value: function (entity) {
            return this.scheduledForUpdate.indexOf(entity) !== -1;
        }
    },

    /**
     * Check if the entity is scheduled for removal
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForDelete: {
        value: function (entity) {
            return this.scheduledForDelete.indexOf(entity) !== -1;
        }
    },

    /**
     * Update the schedules for the given entity
     * If entity scheduled for insert leave as is
     * otherwise plan for update except if planned for delete
     *
     * @param {Sy.EntityInterface} entity
     */

    computeSchedules: {
        value: function (entity) {
            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                state = this.states.state(
                    this.propertyAccessor.getValue(entity, key)
                );

            if (state === this.STATE_MANAGED && !this.isScheduledForUpdate(entity)) {
                this.scheduledForUpdate.push(entity);
            }
        }
    },

    /**
     * Extract the data as a POJO from an entity
     *
     * @param {Sy.EtityInterface} entity
     *
     * @return {Object}
     */

    getEntityData: {
        value: function (entity) {
            var data = {},
                refl = new ReflectionObject(entity);

            refl.getProperties().forEach(function (refl) {
                data[refl.getName()] = refl.getValue();
            });

            return data;
        }
    }

});
