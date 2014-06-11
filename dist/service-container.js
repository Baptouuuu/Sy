/*! sy#0.6.0 - 2014-06-11 */
/**
 * Transform a dotted string to a multi level object.
 * String like "Foo.Bar.Baz" is like doing window.Foo = {Bar: {Baz: {}}}.
 * If object exists it is not transformed.
 * You can modify the root object by doing namespace.call(rootObject, nsString).
 *
 * @param {string} ns
 *
 * @return {object} Last object created
 */

function namespace (ns) {

    var namespaces = null,
        referer = this;

    if (typeof ns === 'string') {
        namespaces = ns.split('.');
    } else if (ns instanceof Array && ns.length > 0) {
        namespaces = ns;
    } else {
        return referer;
    }

    referer[namespaces[0]] = referer[namespaces[0]] || {};

    ns = namespaces.shift();

    return namespace.call(referer[ns], namespaces);

}

/**
 * Set a value into objects, where the chain of object is defined as a dotted string.
 * The last element of the string represent the attribute.
 * The root object can be changed by doing objectSetter.call(rootObject, nsString, value).
 *
 * @param {string} ns
 * @param {mixed} value
 */

function objectSetter (ns, value) {

    var namespaces = '',
        attr = '',
        referer = this,
        idx = ns.lastIndexOf('.');

    if (idx >= 0) {

        attr = ns.substr(idx + 1);
        namespaces = ns.substr(0, idx);

        referer = namespace.call(referer, namespaces);

    } else {

        attr = ns;

    }

    referer[attr] = value;

}

/**
 * Retrieve the attribute in objects, where the chain of object is defined as a dotted string.
 * The last element of the string represent the attribute.
 * The root object can be changed by doing objectGetter.call(rootObject, nsString).
 *
 * @param {string} ns
 *
 * @return {mixed}
 */

function objectGetter (ns) {

    var namespaces = null,
        referer = this;

    if (typeof ns === 'string') {
        namespaces = ns.split('.');

        if (namespaces.length === 1) {
            return referer[ns];
        }

    } else if (ns instanceof Array && ns.length > 1) {
        namespaces = ns;
    } else if (ns instanceof Array && ns.length === 1) {
        return referer[ns[0]];
    } else {
        return undefined;
    }

    ns = namespaces.shift();

    return objectGetter.call(referer[ns], namespaces);

}

/**
 * Capitalize the first letter of a string
 *
 * @param {String} string
 *
 * @return {String}
 */

function capitalize (string) {
    return string.substr(0, 1).toUpperCase() + string.substr(1);
}

/**
 * Use reflection to discover nested objects
 * For an element of the object path (ie: 'foo')
 * the reflection will look in this exact order:
 *     .getFoo()
 *     .get() //and 'foo' will be passed to this method
 *     .foo
 *
 * @param {String} ns
 *
 * @return {mixed}
 */

function reflectedObjectGetter (ns) {

    var namespaces = null,
        referer = this;

    if (typeof ns === 'string') {
        namespaces = ns.split('.');

        if (namespaces.length === 1) {
            return getReflectedValue.call(referer, ns);
        }

    } else if (ns instanceof Array && ns.length > 1) {
        namespaces = ns;
    } else if (ns instanceof Array && ns.length === 1) {
        return getReflectedValue.call(referer, ns[0]);
    } else {
        return undefined;
    }

    ns = namespaces.shift();

    return reflectedObjectGetter.call(getReflectedValue.call(referer, ns), namespaces);

}

function getReflectedValue (property) {
    var referer = new ReflectionObject(this);

    if (referer.hasMethod('get' + capitalize(property))) {
        return referer.getMethod('get' + capitalize(property)).call();
    } else if (referer.hasMethod('get')) {
        return referer.getMethod('get').call(property);
    } else if (referer.hasProperty(property)) {
        return referer.getProperty(property).getValue();
    } else {
        return undefined;
    }
};
namespace('Sy');

/**
 * Interface for all service container objects
 *
 * @package Sy
 * @interface
 */

Sy.ServiceContainerInterface = function () {

};

Sy.ServiceContainerInterface.prototype = Object.create(Object.prototype, {

    /**
     * Inject the parameters object from the global config
     *
     * @param {Object} params
     *
     * @return {Sy.ServiceContainerInterface}
     */

    setParameters: {
        value: function (params) {
            return this;
        }
    },

    /**
     * Return the parameter value based on its path string
     *
     * @param {string} path
     *
     * @return {mixed}
     */

    getParameter: {
        value: function (path) {}
    },

    /**
     * Container name setter
     *
     * @param {string} name
     *
     * @return {Sy.ServiceContainerInterface}
     */

    setName: {
        value: function (name) {

            return this;

        }
    },

    /**
     * Container name getter
     *
     * @return {string}
     */

    getName: {
        value: function () {}
    },

    /**
     * Set a new service inside the container
     *
     * @param {string} name Name of the service (must follow the pattern: "/(\w+::)|(\w+)/i")
     * @param {function} constructor Function that must return the object that will act as a service
     *
     * @return {Sy.ServiceContainerInterface}
     */

    set: {
        value: function (name, constructor) {

            return this;

        }
    },

    /**
     * Retrieve a service via its key
     *
     * @param {string} name
     *
     * @return {object}
     */

    get: {
        value: function (name) {}
    },

    /**
     * Check if a service exist in the container
     *
     * @param {string} name
     *
     * @return {boolean}
     */

    has: {
        value: function (name) {}
    }

});
namespace('Sy');

/**
 * Class used to reverse dependencies in the service container
 *
 * @package Sy
 * @class
 */

Sy.ParamProxy = function () {
    this.parameters = null;
    this.serviceContainer = null;
};
Sy.ParamProxy.prototype = Object.create(Object.prototype, {

    /**
     * Set the parameter object
     *
     * @param {Object} parameters
     *
     * @return {Sy.ParamProxy}
     */

    setParameters: {
        value: function (parameters) {

            this.parameters = parameters;

            return this;

        }
    },

    /**
     * Set the service container it depends on
     *
     * @param {Sy.ServiceContainerInterface} serviceContainer
     *
     * @return {Sy.ParamProxy}
     */

    setServiceContainer: {
        value: function (serviceContainer) {

            if (!(serviceContainer instanceof Sy.ServiceContainerInterface)) {
                throw new TypeError('Invalid service container');
            }

            this.serviceContainer = serviceContainer;

            return this;

        }
    },

    /**
     * Check if the value is a parameter dependency
     *
     * @param {String} value
     *
     * @return {Boolean}
     */

    isParameter: {
        value: function (value) {

            if (typeof value === 'string' && new RegExp(/^%.*%$/i).test(value)) {
                return true;
            }

            return false;

        }
    },

    /**
     * Get the parameter dependency
     *
     * @param {String} path Object path string (ie: '%object.path%')
     *
     * @return {Boolean}
     */

    getParameter: {
        value: function (path) {

            path = path.substring(1, path.length - 1);

            return objectGetter.call(this.parameters, path);

        }
    },

    /**
     * Check if the value is a service dependency
     *
     * @param {String} value
     *
     * @return {Boolean}
     */

    isService: {
        value: function (value) {

            if (typeof value === 'string' && value.substring(0, 1) === '@') {
                return true;
            }

            return false;

        }
    },

    /**
     * Get the service dependency
     *
     * @param {String} name ie: '@service::name'
     *
     * @return {Object}
     */

    getService: {
        value: function (name) {

            name = name.substring(1);

            return this.serviceContainer.get(name);

        }
    },

    /**
     * Check wether the value is a dependency or not
     *
     * @param {mixed} value
     *
     * @return {Boolean}
     */

    isDependency: {
        value: function (value) {

            if (this.isParameter(value) || this.isService(value)) {
                return true;
            }

            return false;

        }
    },

    /**
     * Get the dependecy
     *
     * @param {String} name
     *
     * @return {mixed}
     */

    getDependency: {
        value: function (name) {

            if (this.isParameter(name)) {
                return this.getParameter(name);
            } else if (this.isService(name)) {
                return this.getService(name);
            }

            return name;

        }
    }

});

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