namespace('Sy');

/**
 * Default implementation of the service container interface
 *
 * @package Sy
 * @class
 * @implements {Sy.ServiceContainerInterface}
 *
 * @param {string} name
 */

Sy.ServiceContainer = function (name) {

    this.name = '';
    this.services = {};
    this.creators = {};

    this.setName(name);

};

Sy.ServiceContainer.prototype = Object.create(Sy.ServiceContainerInterface.prototype, {

    /**
     * @inheritDoc
     */

    get: {

        value: function (serviceName) {

            if (this.services[serviceName] === undefined && this.creators[serviceName]) {

                this.services[serviceName] = this.creators[serviceName].fn.apply({}, this.creators[serviceName].args);
                delete this.creators[serviceName];

            } else if (this.services[serviceName] === undefined) {

                throw new TypeError('Unknown service');

            }

            return this.services[serviceName];

        }

    },

    /**
     * @inheritDoc
     */

    set: {

        value: function (serviceName, creator, args) {

            if (typeof creator != 'function'){
                throw new TypeError('Invalid creator type');
            }

            if (args && !(args instanceof Array)) {
                throw new TypeError('Invalid args type (must be an array)');
            }

            if (this.creators[serviceName] !== undefined || this.services[serviceName] !== undefined) {
                throw new TypeError('Service name already used');
            }

            this.creators[serviceName] = {
                fn: creator,
                args: args
            };

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

    },

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    }

});