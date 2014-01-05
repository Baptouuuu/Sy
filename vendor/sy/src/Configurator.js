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

};

Sy.Configurator.prototype = Object.create(Sy.ConfiguratorInterface.prototype, {

    /**
     * @inheritDoc
     */

    set: {
        value: function (key, value) {

            if (key instanceof Object && !value) {
                this.config = _.extend(this.config, key);
            } else {
                objectSetter.call(this.config, key, value);
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

            if (this.has(key)) {
                value = objectGetter.call(this.config, key);
            }

            return value;

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (key) {

            try {

                objectGetter.call(this.config, key);

                return true;

            } catch (error) {

                if (error instanceof ReferenceError) {
                    return false;
                }

            }

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