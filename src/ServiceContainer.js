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
    this.definitions = {};
    this.proxy = new Sy.ParamProxy();
    this.proxy.setServiceContainer(this);

    this.setName(name);

};

Sy.ServiceContainer.prototype = Object.create(Sy.ServiceContainerInterface.prototype, {

    PATTERN: {
        value: '^([a-z]+::|[a-z]+)+$',
        writable: false,
        configurable: false
    },

    /**
     * @inheritDoc
     */

    setParameters: {
        value: function (params) {
            this.proxy.setParameters(params);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getParameter: {
        value: function (path) {

            return this.proxy.getParameter('%' + path + '%');

        }
    },

    /**
     * @inheritDoc
     */

    get: {

        value: function (serviceName) {

            if (this.services[serviceName] === undefined && this.definitions[serviceName]) {

                var opts = this.definitions[serviceName],
                    service;

                if (opts.type === 'creator') {
                    service = this.buildServiceByCreator(serviceName);
                } else if (opts.type === 'prototype') {
                    service = this.buildServiceByDefinition(serviceName);
                }

                this.services[serviceName] = service;
                delete this.definitions[serviceName];

            } else if (this.services[serviceName] === undefined) {

                throw new ReferenceError('Unknown service');

            }

            return this.services[serviceName];

        }

    },

    /**
     * Build a service via its creator function
     *
     * @private
     * @param {string} name
     *
     * @return {Object}
     */

    buildServiceByCreator: {
        value: function (name) {
            return this.definitions[name].fn.apply(this);
        }
    },

    /**
     * Build a service based on its definition
     *
     * @private
     * @param {string} name
     *
     * @return {Object}
     */

    buildServiceByDefinition: {
        value: function (name) {

            var opts = this.definitions[name],
                constructor = objectGetter(opts.constructor),
                service;

            if (typeof constructor !== 'function') {
                throw new TypeError('Invalid constructor');
            }

            if (opts.arguments) {
                service = new constructor(opts.arguments);
            } else {
                service = new constructor();
            }

            if (opts.calls instanceof Array) {
                for (var i = 0, l = opts.calls.length; i < l; i++) {
                    var args = opts.calls[i][1];

                    for (var a = 0, al = args.length; a < al; a++) {
                        if (this.proxy.isDependency(args[a])) {
                            args[a] = this.proxy.getDependency(args[a]);
                        }
                    }

                    service[opts.calls[i][0]].apply(service, args);
                }
            }

            return service;

        }
    },

    /**
     * @inheritDoc
     */

    set: {

        value: function (serviceName, creator) {

            if (serviceName instanceof Object) {
                this.setPrototypes(serviceName);
            } else {
                this.setCreator(serviceName, creator);
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
     */

    setCreator: {
        value: function (serviceName, creator) {

            var regex = new RegExp(this.PATTERN, 'gi');

            if (!regex.test(serviceName)) {
                throw new SyntaxError('Service name "' + serviceName + '" does not follow pattern convention');
            }

            if (typeof creator !== 'function'){
                throw new TypeError('Invalid creator type');
            }

            if (this.has(serviceName)) {
                throw new TypeError('Service name "' + serviceName + '" already used');
            }

            this.definitions[serviceName] = {
                fn: creator,
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

                        var regex = new RegExp(this.PATTERN, 'gi');

                        if (!regex.test(name)) {
                            throw new SyntaxError('Service name "' + name + '" does not follow pattern convention');
                        }

                        if (this.has(name)) {
                            throw new TypeError('Service name "' + name + '" already used');
                        }

                        this.definitions[name] = definitions[name];
                        this.definitions[name].type = 'prototype';
                    }
                }

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (name) {

            if (this.services[name] || this.definitions[name]) {
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