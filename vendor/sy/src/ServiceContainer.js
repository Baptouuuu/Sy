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
    this.parameters = {};

    this.setName(name);

};

Sy.ServiceContainer.prototype = Object.create(Sy.ServiceContainerInterface.prototype, {

    /**
     * @inheritDoc
     */

    setParameters: {
        value: function (params) {
            this.parameters = params;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    get: {

        value: function (serviceName) {

            if (this.services[serviceName] === undefined && this.creators[serviceName]) {

                var opts = this.creators[serviceName],
                    service;

                if (opts.type === 'creator') {
                    service = this.creators[serviceName].fn.apply(this, this.creators[serviceName].args);
                } else if (opts.type === 'prototype') {
                    if (opts.arguments) {
                        service = new (objectGetter(opts.constructor))(opts.arguments);
                    } else {
                        service = new (objectGetter(opts.constructor))();
                    }

                    if (opts.calls instanceof Array) {
                        for (var i = 0, l = opts.calls.length; i < l; i++) {
                            var args = opts.calls[i][1];

                            for (var a = 0, al = args.length; a < al; a++) {
                                if (typeof args[a] === 'string' && args[a].substring(0, 1) === '@') {
                                    args[a] = this.get(args[a].substr(1));
                                } else if (typeof args[a] === 'string' && new RegExp(/^%.*%$/i).test(args[a])) {
                                    args[a] = objectGetter.call(
                                        this.parameters,
                                        args[a].substring(1, args[a].length - 1)
                                    );
                                }
                            }

                            service[opts.calls[i][0]].apply(service, args);
                        }
                    }
                }

                this.services[serviceName] = service;
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

            if (serviceName instanceof Object) {
                this.setPrototypes(serviceName);
            } else {
                this.setCreator(serviceName, creator, args);
            }

            return this;

        }

    },

    /**
     * Register a new service creator definition
     *
     * @private
     * @param {string} serviceName
     * @param {funtcion} creator
     * @param {Array} args
     */

    setCreator: {
        value: function (serviceName, creator, args) {

            if (typeof creator !== 'function'){
                throw new TypeError('Invalid creator type');
            }

            if (args && !(args instanceof Array)) {
                throw new TypeError('Invalid args type (must be an array)');
            }

            if (this.has(serviceName)) {
                throw new TypeError('Service name "' + serviceName + '" already used');
            }

            this.creators[serviceName] = {
                fn: creator,
                args: args,
                type: 'creator'
            };

        }
    },

    /**
     * Register new services prototype definitions
     *
     * @private
     * @param {Object} definitions
     */

    setPrototypes: {
        value: function (definitions) {

            for (var name in definitions) {
                    if (definitions.hasOwnProperty(name)) {

                        if (this.has(name)) {
                            throw new TypeError('Service name "' + name + '" already used');
                        }

                        this.creators[name] = definitions[name];
                        this.creators[name].type = 'prototype';
                    }
                }

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