namespace('Sy.Storage');

/**
 * Generates new engines
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.EngineFactory = function () {

    this.engines = {};

};

Sy.Storage.EngineFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set a new engine constructor
     *
     * @param {string} name Name of the engine
     * @param {function} constructor
     *
     * @return {Sy.Storage.EngineFactory}
     */

    setEngine: {
        value: function (name, constructor) {

            if (typeof constructor !== 'function') {
                throw new TypeError('Invalid engine constructor');
            }

            if (this.engines[name]) {
                throw new TypeError('Engine name already used');
            }

            this.engines[name] = constructor;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, version, entitiesMeta) {

            if (!this.engines[name]) {
                throw new ReferenceError('Specified engine does not exist');
            }

            var engine = new this.engines[name](version, entitiesMeta);

            if (!(engine instanceof Sy.Storage.EngineInterface)) {
                throw new TypeError('Invalid engine');
            }

            return engine;

        }
    }

});