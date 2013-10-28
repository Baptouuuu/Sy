namespace('Sy');

Sy.ServiceContainer = function (name) {

    this.name = '';
    this.services = {};
    this.creators = {};

    this.setName(name);

};

Sy.ServiceContainer.prototype = Object.create(Sy.ServiceContainerInterface.prototype, {

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

    getName: {

        value: function () {

            return this.name;

        }

    },

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    }

});