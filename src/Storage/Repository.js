namespace('Sy.Storage');

/**
 * Default implementation of the entity repository
 *
 * @package Sy
 * @subpackage Storage
 * @implements {Sy.Storage.RepositoryInterface}
 * @class
 */

Sy.Storage.Repository = function () {

    this.engine = null;
    this.entityKey = null;
    this.entityConstructor = null;
    this.uow = null;
    this.name = null;

};

Sy.Storage.Repository.prototype = Object.create(Sy.Storage.RepositoryInterface.prototype, {

    /**
     * @inheritDoc
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
     * Return the unit of work
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    getUnitOfWork: {
        value : function () {
            return this.uow;
        }
    },

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.Storage.EngineInterface)) {
                throw new TypeError('Invalid engine');
            }

            this.engine = engine;
            this.uow.setEngine(engine);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setEntityKey: {
        value: function (key) {

            this.entityKey = key;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setEntityConstructor: {
        value: function (constructor) {

            if (!(constructor.prototype instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity constructor');
            }

            this.entityConstructor = constructor;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setIndexes: {
        value: function (indexes) {

            if (!(indexes instanceof Array)) {
                throw new TypeError('Invalid indexes definition');
            }

            this.indexes = indexes;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    persist: {
        value: function (entity) {

            if (!(entity instanceof this.entityConstructor)) {
                throw new TypeError('Entity not handled by the repository');
            }

            this.uow.handle(entity);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (entity) {

            this.uow.remove(entity);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    flush: {
        value: function () {

            this.uow.flush();

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    findOneBy: {
        value: function (args) {

            if (args.index === this.entityKey) {
                this.engine.read(
                    this.name,
                    args.value,
                    function (object) {
                        args.callback(
                            this.buildEntity(object)
                        );
                    }.bind(this)
                );
            } else {
                args.limit = 1;
                this.findBy(args);
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    findBy: {
        value: function (args) {

            this.engine.find(
                this.name,
                {
                    index: args.index,
                    value: args.value,
                    callback: function (results) {
                        this.findListener(args.callback, results);
                    }.bind(this),
                    limit: args.limit
                }
            );

            return this;

        }
    },

    /**
     * Intercept raw results and transform objects array into enitites one
     *
     * @private
     * @param {function} callback
     * @param {Array} results
     *
     * @return {void}
     */

    findListener: {
        value: function (callback, results) {

            var data = [];

            for (var i = 0, l = results.length; i < l; i++) {
                data.push(
                    this.buildEntity(results[i])
                );
            }

            callback(data);

        }
    },

    /**
     * Transform a raw object into an entity
     *
     * @private
     * @param {object} object
     *
     * @return {Sy.EntityInterface}
     */

    buildEntity: {
        value: function (object) {

            var entity = new this.entityConstructor();

            entity.set(object);

            return entity;

        }
    }

});