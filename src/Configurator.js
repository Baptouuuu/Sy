namespace('Sy');

/**
 * Wrapper to set/retrieve key/value pairs
 *
 * @package Sy
 * @class
 * @implements {Sy.ConfiguratorInterface}
 */

Sy.Configurator = function () {

    this.name = '';
    this.config = {};
    this.accessor = new Sy.PropertyAccessor(true);

};

Sy.Configurator.prototype = Object.create(Sy.ConfiguratorInterface.prototype, {

    /**
     * @inheritDoc
     */

    set: {
        value: function (key, value) {

            if (key instanceof Object && value === undefined) {
                this.config = _.extend(this.config, key);
            } else {
                if (!this.accessor.isReadable(this.config, key)) {
                    namespace.call(this.config, key);
                }

                this.accessor.setValue(this.config, key, value);
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (key) {

            var value;

            if (key === undefined) {
                value = this.config;
            } else if (this.has(key)) {
                value = this.accessor.getValue(this.config, key);
            }

            return value;

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (key) {
            return this.accessor.isReadable(this.config, key);
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

    getName: {
        value: function () {

            return this.name;

        }
    }

});