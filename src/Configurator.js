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

            if (key instanceof Object && value === undefined) {
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

            if (key === undefined) {
                value = this.config;
            } else if (this.has(key)) {
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
            var elements = key.split('.'),
                object = this.config,
                prop;

            while (elements.length !== 0) {
                prop = elements.shift();

                if (!object.hasOwnProperty(prop)) {
                    return false;
                }

                object = object[prop];
            }

            return true;
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