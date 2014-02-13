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
                        service = new opts.constructor(opts.arguments);
                    } else {
                        service = new opts.constructor();
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

            var regexp = new RegExp(/^((\w+::)|(\w+))+$/gi);

            if (serviceName instanceof Object) {

                for (var name in serviceName) {
                    if (serviceName.hasOwnProperty(name)) {
                        this.creators[name] = serviceName[name];
                        this.creators[name].type = 'prototype';
                    }
                }

            } else {

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
                    args: args,
                    type: 'creator'
                };

            }

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