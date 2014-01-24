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

                this.services[serviceName] = this.creators[serviceName].fn.apply(this, this.creators[serviceName].args);
                delete this.creators[serviceName];

            } else if (this.services[serviceName] === undefined) {

                throw new ReferenceError('Unknown service');

            }

            return this.services[serviceName];

        }

    },

    /**
     * @inheritDoc
     */

    set: {

        value: function (serviceName, creator, args) {

            var regexp = new RegExp(/^((\w+::)|(\w+))+$/gi);

            if (!regexp.test(serviceName)) {
                throw new SyntaxError('Service name "' + serviceName + '" does not follow pattern convention');
            }

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

    has: {
        value: function (name) {

            if (this.services[name] || this.creators[name]) {
                return true;
            }

            return false;

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