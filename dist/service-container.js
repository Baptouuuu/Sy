/*! sy#1.2.0 - 2015-01-13 */
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
namespace('Sy.ServiceContainer');

/**
 * Service container
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Core = function () {
    this.initialized = {
        container: this
    };
    this.services = {};
    this.loading = [];
    this.config = null;
    this.compiler = null;
    this.compiled = false;
    this.propertyAccessor = new Sy.PropertyAccessor(true);
};

Sy.ServiceContainer.Core.prototype = Object.create(Object.prototype, {

    /**
     * Add a set of services definitions to the container
     *
     * @param {Object} services
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    set: {
        value: function (services) {
            var service,
                alias,
                def;

            for (var name in services) {
                alias = /^@.+$/;

                if (services.hasOwnProperty(name)) {
                    if (
                        this.services[name] &&
                        this.services[name] instanceof Sy.ServiceContainer.Definition
                    ) {
                        throw new TypeError('Service name already used');
                    }

                    def = services[name];

                    if (typeof def === 'string' && alias.test(def)) {
                        service = new Sy.ServiceContainer.Alias(def.substr(1));
                    } else {
                        service = new Sy.ServiceContainer.Definition();

                        service.setConstructor(def.constructor);

                        if (def.factory instanceof Array) {
                            service
                                .setFactoryService(new Sy.ServiceContainer.Reference(def.factory[0]))
                                .setFactoryMethod(def.factory[1]);
                        }

                        if (def.configurator instanceof Array) {
                            service
                                .setConfigurator(new Sy.ServiceContainer.Reference(def.configurator[0]))
                                .setConfiguratorMethod(def.configurator[1]);
                        }

                        if (def.calls instanceof Array) {
                            def.calls.forEach(function (el) {
                                service.addCall(el[0], el[1]);
                            }, this);
                        }

                        if (def.hasOwnProperty('private')) {
                            service.setPrivate();
                        }

                        if (def.tags instanceof Array) {
                            def.tags.forEach(function (el) {
                                service.addTag(el.name, el);
                            }, this);
                        }

                        if (def.hasOwnProperty('abstract')) {
                            service.setAbstract();
                        }

                        if (def.hasOwnProperty('prototype')) {
                            service.setPrototype();
                        }

                        if (def.hasOwnProperty('parent')) {
                            service.setParent(new Sy.ServiceContainer.Reference(def.parent));
                        }
                    }

                    this.services[name] = service;
                }
            }

            return this;
        }
    },

    /**
     * Set an already initialized object
     *
     * @param {String} name
     * @param {Object} service
     *
     * @return {Sy.ServiceContainer.Core}
     */

    setInstance: {
        value: function (name, service) {
            this.initialized[name] = service;

            return this;
        }
    },

    /**
     * Return the instance of a defined service
     *
     * @param {String} id
     *
     * @throws {ReferenceError} If the service has not been defined or is private
     *
     * @return {Object}
     */

    get: {
        value: function (id) {
            if (!this.services.hasOwnProperty(id) && !this.initialized.hasOwnProperty(id)) {
                throw new ReferenceError('Unknown service');
            }

            if (this.initialized.hasOwnProperty(id)) {
                return this.initialized[id];
            }

            if (this.services[id] instanceof Sy.ServiceContainer.Alias) {
                return this.get(this.services[id].toString());
            }

            if (this.loading.length === 0 && !this.services[id].isPublic()) {
                throw new Error('Can\'t access private service');
            }

            if (this.loading.length === 0 && this.services[id].isAbstract()) {
                throw new Error('Can\'t access abstract service');
            }

            if (this.loading.indexOf(id) !== -1) {
                this.loading = [];
                throw new Error('Circular referencing');
            }

            var def = this.services[id],
                constructor = this.propertyAccessor.getValue(window, def.getConstructor()),
                service,
                factory;

            this.loading.push(id);

            if (def.hasFactory()) {
                factory = this.get(
                    def
                        .getFactoryService()
                        .toString()
                );
                service = factory[def.getFactoryMethod()].call(factory, def.getConstructor());

                if (!(service instanceof constructor)) {
                    throw new TypeError('Factory built an object different from the specified type');
                }
            } else {
                service = new constructor();
            }

            def.getCalls().forEach(function (call) {
                var method = call[0],
                    args = call[1];

                args.forEach(function (arg, idx, args) {
                    if (arg instanceof Sy.ServiceContainer.Reference) {
                        args[idx] = this.get(arg.toString());
                    } else if (arg instanceof Sy.ServiceContainer.Parameter) {
                        args[idx] = this.getParameter(arg.toString());
                    }
                }, this);

                service[method].apply(service, args);
            }, this);

            if (def.hasConfigurator()) {
                this
                    .get(
                        def
                            .getConfigurator()
                            .toString()
                    )
                    [def.getConfiguratorMethod()](service);
            }

            if (!def.isPrototype()) {
                this.initialized[id] = service;
            }

            this.loading.splice(this.loading.indexOf(id), 1);
            return service;
        }
    },

    /**
     * Remove a service definition
     *
     * @param {String} id
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    remove: {
        value: function (id) {
            delete this.services[id];

            return this;
        }
    },

    /**
     * Return all the services ids
     *
     * @return {Array}
     */

    getServiceIds: {
        value: function () {
            return Object.keys(this.services);
        }
    },

    /**
     * Check if a service is defined
     *
     * @param {String} id
     *
     * @return {Boolean}
     */

    has: {
        value: function (id) {
            return this.services.hasOwnProperty(id) || this.initialized.hasOwnProperty(id);
        }
    },

    /**
     * Check if a service has been initialized
     *
     * @param {String} id
     *
     * @return {Boolean}
     */

    isInitialized: {
        value: function (id) {
            return this.initialized.hasOwnProperty(id);
        }
    },

    /**
     * Set an config object
     *
     * @param {Sy.ConfiguratorInterface} config
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    setParameters: {
        value: function (config) {
            if (!(config instanceof Sy.ConfiguratorInterface)) {
                throw new TypeError('Invalid parameters object');
            }

            this.config = config;

            return this;
        }
    },

    /**
     * Return a parameter
     *
     * @param {String} path
     *
     * @throws {ReferenceError} If the path is not accessible
     *
     * @return {mixed}
     */

    getParameter: {
        value: function (path) {
            return this.config.get(path);
        }
    },

    /**
     * Check if a parameter is defined
     *
     * @param {String} path
     *
     * @return {Boolean}
     */

    hasParameter: {
        value: function (path) {
            return this.config.has(path);
        }
    },

    /**
     * Set a new parameter in the config object
     *
     * @param {String} key
     * @param {mixed} value
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    setParameter: {
        value: function (key, value) {
            this.config.set(key, value);

            return this;
        }
    },

    /**
     * Return the definition of a service
     *
     * @param {String} id
     *
     * @throws {ReferenceError} If the service does not exist or the container has been compiled
     *
     * @return {Sy.ServiceContainer.Definition}
     */

    getDefinition: {
        value: function (id) {
            if (this.compiled === true) {
                throw new ReferenceError('Can\'t access a definition once container compiled');
            }

            return this.services[id];
        }
    },

    /**
     * Set a service definition
     *
     * @param {String} id
     * @param {Sy.ServiceContainer.Definition} definition
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    setDefinition: {
        value: function (id, definition) {
            if (!(definition instanceof Sy.ServiceContainer.Definition)) {
                throw new TypeError('Invalid definition');
            }

            this.services[id] = definition;

            return this;
        }
    },

    /**
     * Set the compiler
     *
     * @param {Sy.ServiceContainer.Compiler} compiler
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    setCompiler: {
        value: function (compiler) {
            if (!(compiler instanceof Sy.ServiceContainer.Compiler)) {
                throw new TypeError('Invalid compiler');
            }

            this.compiler = compiler;

            return this;
        }
    },

    /**
     * Add a compiler pass
     *
     * @param {Sy.ServiceContainer.CompilerPassInterface} pass
     * @param {String} type
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    addPass: {
        value: function (pass, type) {
            this.compiler.addPass(pass, type);

            return this;
        }
    },

    /**
     * Compile the container
     */

    compile: {
        value: function () {
            this.compiler.compile(this);

            Object.freeze(this.services);
            this.compiled = true;
        }
    },

    /**
     * Return the service ids flagged with the specified tag
     *
     * @param {String} tag
     *
     * @return {Array}
     */

    findTaggedServiceIds: {
        value: function (tag) {
            var ids = this.getServiceIds(),
                matched = [];

            ids.forEach(function (id) {
                if (!(this.services[id] instanceof Sy.ServiceContainer.Definition)) {
                    return;
                }

                var filtered = this.services[id].getTag(tag);

                if (filtered.length > 0) {
                    matched.push({id: id, tags: filtered});
                }
            }, this);

            return matched;
        }
    }

});

namespace('Sy.ServiceContainer');

/**
 * Alias to another service
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Alias = function (id) {
    this.id = id;
};

Sy.ServiceContainer.Alias.prototype = Object.create(Object.prototype, {

    /**
     * Return the original service id
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.id
        }
    }

});

namespace('Sy.ServiceContainer');

/**
 * Optimize a container by compiling it with successive passes
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Compiler = function () {
    this.beforeOpti = [];
    this.opti = [
        new Sy.ServiceContainer.CompilerPass.ResolveParameterPlaceholder(),
        new Sy.ServiceContainer.CompilerPass.ResolveReferencePlaceholder(),
        new Sy.ServiceContainer.CompilerPass.ApplyParentDefinition(),
    ];
    this.beforeRm = [];
    this.rm = [
        new Sy.ServiceContainer.CompilerPass.RemoveAbstractDefinitions(),
    ];
    this.afterRm = [];
};

Sy.ServiceContainer.Compiler.prototype = Object.create(Object.prototype, {

    /**
     * Add a new pass to the compiler
     *
     * @param {Sy.ServiceContainer.CompilerPassInterface} pass
     * @param {String} type Default to before optimization
     */

    addPass: {
        value: function (pass, type) {
            if (!(pass instanceof Sy.ServiceContainer.CompilerPassInterface)) {
                throw new TypeError('Invalid compiler pass');
            }

            switch (type) {
                case pass.BEFORE_OPTIMIZATION:
                    this.beforeOpti.push(pass);
                    break;
                case pass.OPTIMIZE:
                    this.opti.push(pass);
                    break;
                case pass.BEFORE_REMOVING:
                    this.beforeRm.push(pass);
                    break;
                case pass.REMOVE:
                    this.rm.push(pass);
                    break;
                case pass.AFTER_REMOVING:
                    this.afterRm.push(pass);
                    break;
                default:
                    this.beforeOpti.push(pass);
            }
        }
    },

    /**
     * Compile the service container
     *
     * @param {Sy.ServiceContainer.Core} container
     */

    compile: {
        value: function (container) {
            if (!(container instanceof Sy.ServiceContainer.Core)) {
                throw new TypeError('Invalid service container');
            }

            this.beforeOpti.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.opti.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.beforeRm.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.rm.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.afterRm.forEach(function (pass) {
                pass.process(container);
            }, this);
        }
    }

});

namespace('Sy.ServiceContainer');

/**
 * Interface that each compiler pass must implement
 *
 * A pass allow to alter/optimize service definitions
 * at container compilation time
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @interface
 */

Sy.ServiceContainer.CompilerPassInterface = function () {};
Sy.ServiceContainer.CompilerPassInterface.prototype = Object.create(Object.prototype, {

    BEFORE_OPTIMIZATION: {
        value: 'before_optimization',
        writable: false
    },

    OPTIMIZE: {
        value: 'optimize',
        writable: false,
    },

    BEFORE_REMOVING: {
        value: 'before_removing',
        writable: false
    },

    REMOVE: {
        value: 'remove',
        writable: false
    },

    AFTER_REMOVING: {
        value: 'after_removing',
        writable: false
    },

    /**
     * The container is passed to the pass to do its own work
     *
     * @param {Sy.ServiceContainer.Core} container
     */

    process: {
        value: function (container) {}
    }

});

namespace('Sy.ServiceContainer');

/**
 * Service definition
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Definition = function () {
    this.constructor = null;
    this.factoryService = null;
    this.factoryMethod = null;
    this.configuratorService = null;
    this.configuratorMethod = null;
    this.calls = [];
    this.public = true;
    this.tags = [];
    this.abstract = false;
    this.parent = null;
    this.proto = false;
};

Sy.ServiceContainer.Definition.prototype = Object.create(Object.prototype, {

    /**
     * Set the path to the service constructor
     *
     * @param {String} path
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setConstructor: {
        value: function (constructor) {
            this.constructor = constructor;

            return this;
        }
    },

    /**
     * Return the constructor path
     *
     * @return {String}
     */

    getConstructor: {
        value: function () {
            return this.constructor;
        }
    },

    /**
     * Set the factory service reference
     *
     * @param {Sy.ServiceContainer.Reference} reference
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setFactoryService: {
        value: function (reference) {
            if (!(reference instanceof Sy.ServiceContainer.Reference)) {
                throw new TypeError('Invalid reference');
            }

            this.factoryService = reference;

            return this;
        }
    },

    /**
     * Return the factory service reference
     *
     * @return {Sy.ServiceContainer.Reference}
     */

    getFactoryService: {
        value: function () {
            return this.factoryService;
        }
    },

    /**
     * Set the factory method
     *
     * @param {String} method
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setFactoryMethod: {
        value: function (method) {
            this.factoryMethod = method;

            return this;
        }
    },

    /**
     * Return the factory method
     *
     * @return {String}
     */

    getFactoryMethod: {
        value: function () {
            return this.factoryMethod;
        }
    },

    /**
     * Check if a factory is defined
     *
     * @return {Boolean}
     */

    hasFactory: {
        value: function () {
            return !!this.factoryService && !!this.factoryMethod;
        }
    },

    /**
     * Set the configurator reference
     *
     * @param {Sy.ServiceContainer.Reference} configurator
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setConfigurator: {
        value: function (configurator) {
            if (!(configurator instanceof Sy.ServiceContainer.Reference)) {
                throw new TypeError('Invalid reference');
            }

            this.configuratorService = configurator;

            return this;
        }
    },

    /**
     * Return the configurator reference
     *
     * @return {Sy.ServiceContainer.Reference}
     */

    getConfigurator: {
        value: function () {
            return this.configuratorService;
        }
    },

    /**
     * Set configurator method
     *
     * @param {String} method
     *
     * @return {Sy.ServiceConfigurator.Definition} self
     */

    setConfiguratorMethod: {
        value: function (method) {
            this.configuratorMethod = method;

            return this;
        }
    },

    /**
     * Return configurator method
     *
     * @return {String}
     */

    getConfiguratorMethod: {
        value: function () {
            return this.configuratorMethod;
        }
    },

    /**
     * Check if service has a configurator
     *
     * @return {Boolean}
     */

    hasConfigurator: {
        value: function () {
            return !!this.configuratorService && !!this.configuratorMethod;
        }
    },

    /**
     * Add a new call statement
     *
     * @param {String} method
     * @param {Array} args Array of arguments
     * @param {Boolean} pos Whether to append or prepend the call (default to append)
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    addCall: {
        value: function (method, args, pos) {
            var m = !!pos ? 'unshift' : 'push';

            this.calls[m]([method, args]);

            return this;
        }
    },

    /**
     * Return the list of calls
     *
     * @return {Array}
     */

    getCalls: {
        value: function () {
            return this.calls;
        }
    },

    /**
     * Set the service as private
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setPrivate: {
        value: function () {
            this.public = false;

            return this;
        }
    },

    /**
     * Check if the service is public
     *
     * @return {Boolean}
     */

    isPublic: {
        value: function () {
            return this.public;
        }
    },

    /**
     * Add a tag
     *
     * @param {String} name
     * @param {Object} data
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    addTag: {
        value: function (name, data) {
            data = data || {};
            this.tags.push([name, data]);

            return this;
        }
    },

    /**
     * Return the list of tags
     *
     * @return {Array}
     */

    getTags: {
        value: function () {
            return this.tags;
        }
    },

    /**
     * Return the list of tags matching the name
     *
     * @param {String} name
     *
     * @return {Array}
     */

    getTag: {
        value: function (name) {
            return this.tags.filter(function (el) {
                return el[0] === name;
            }, this);
        }
    },

    /**
     * Set the service as abstract
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setAbstract: {
        value: function () {
            this.abstract = true;

            return this;
        }
    },

    /**
     * Check if the service is abstract
     *
     * @return {Boolean}
     */

    isAbstract: {
        value: function () {
            return this.abstract;
        }
    },

    /**
     * Set a service reference as parent
     *
     * @param {Sy.ServiceContainer.Reference} parent
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setParent: {
        value: function (parent) {
            if (!(parent instanceof Sy.ServiceContainer.Reference)) {
                throw new TypeError('Invalid reference');
            }

            this.parent = parent;

            return this;
        }
    },

    /**
     * Check if the service has a parent
     *
     * @return {Boolean}
     */

    hasParent: {
        value: function () {
            return !!this.parent;
        }
    },

    /**
     * Return the parent reference
     *
     * @return {Sy.ServiceContainer.Reference}
     */

    getParent: {
        value: function () {
            return this.parent;
        }
    },

    /**
     * Set the service as prototype, meaning a new one
     * is built each time the service is accessed
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setPrototype: {
        value: function () {
            this.proto = true;

            return this;
        }
    },

    /**
     * Check if the service is a prototype
     *
     * @return {Boolean}
     */

    isPrototype: {
        value: function () {
            return this.proto;
        }
    }

});

namespace('Sy.ServiceContainer');

/**
 * Reference of a parameter from the configurator
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Parameter = function (id) {
    this.id = id;
};

Sy.ServiceContainer.Parameter.prototype = Object.create(Object.prototype, {

    /**
     * Return the parameter id
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.id;
        }
    }

})

namespace('Sy.ServiceContainer');

/**
 * Reference to another service
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Reference = function (id) {
    this.id = id;
};

Sy.ServiceContainer.Reference.prototype = Object.create(Object.prototype, {

    /**
     * Return the referenced service id
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.id;
        }
    }

});

namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Apply a parent definition to its children
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.ApplyParentDefinition = function () {};
Sy.ServiceContainer.CompilerPass.ApplyParentDefinition.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id),
                        parent,
                        calls;

                    if (!(def instanceof Sy.ServiceContainer.Definition)) {
                        return;
                    }

                    if (def.hasParent()) {
                        parent = this.getDefinition(
                            def.getParent().toString()
                        );

                        if (parent.hasFactory() && !def.hasFactory()) {
                            def.setFactoryService(
                                parent.getFactoryService()
                            );
                            def.setFactoryMethod(
                                parent.getFactoryMethod()
                            );
                        }

                        if (parent.hasConfigurator() && !def.hasConfigurator()) {
                            def.setConfigurator(
                                parent.getConfigurator()
                            );
                            def.setConfiguratorMethod(
                                parent.getConfiguratorMethod()
                            );
                        }

                        calls = parent.getCalls();

                        for (var i = calls.length - 1; i >= 0; i--) {
                            def.addCall(
                                calls[i][0],
                                calls[i][1],
                                true
                            );
                        }
                    }
                }, container);
        }
    }

});

namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Remove abstract definitions as their're been copied to their children
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.RemoveAbstractDefinitions = function () {};
Sy.ServiceContainer.CompilerPass.RemoveAbstractDefinitions.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id);

                    if (!(def instanceof Sy.ServiceContainer.Definition)) {
                        return;
                    }

                    if (def.isAbstract()) {
                        this.remove(id);
                    }
                }, container);
        }
    }

});

namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Replace the references of container parameters by a Parameter object
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.ResolveParameterPlaceholder = function () {};
Sy.ServiceContainer.CompilerPass.ResolveParameterPlaceholder.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id),
                        re = /^%[a-zA-Z-_.]+%$/,
                        calls;

                    if (!(def instanceof Sy.ServiceContainer.Definition)) {
                        return;
                    }

                    calls = def.getCalls();

                    for (var i = 0, l = calls.length; i < l; i++) {
                        for (var j = 0, m = calls[i][1].length; j < m; j++) {
                            if (re.test(calls[i][1][j])) {
                                calls[i][1][j] = new Sy.ServiceContainer.Parameter(
                                    calls[i][1][j].substring(
                                        1,
                                        calls[i][1][j].length - 1
                                    )
                                );
                            }
                        }
                    }
                }, container);
        }
    }

});

namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Replace the references of other services by a Reference object
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.ResolveReferencePlaceholder = function () {};
Sy.ServiceContainer.CompilerPass.ResolveReferencePlaceholder.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id),
                        re = /^@.+$/,
                        calls;

                    if (!(def instanceof Sy.ServiceContainer.Definition)) {
                        return;
                    }

                    calls = def.getCalls();

                    for (var i = 0, l = calls.length; i < l; i++) {
                        for (var j = 0, m = calls[i][1].length; j < m; j++) {
                            if (re.test(calls[i][1][j])) {
                                calls[i][1][j] = new Sy.ServiceContainer.Reference(
                                    calls[i][1][j].substr(1)
                                );
                            }
                        }
                    }
                }, container);
        }
    }

});

namespace('Sy');

/**
 * Tool to easily retrieve/set data of a particular path in an object graph
 *
 * @package Sy
 * @class
 */

Sy.PropertyAccessor = function (disableGetterSetter) {
    this.disableGetterSetter = !!disableGetterSetter;
};

Sy.PropertyAccessor.prototype = Object.create(Object.prototype, {

    prefixes: {
        value: ['get', 'is', 'has'],
        writable: false,
        configurable: false
    },

    /**
     * Return the value for the given object path
     *
     * @param {Object} object Path root
     * @param {String|Array} path
     *
     * @throws {ReferenceError} If the path is not reachable
     *
     * @return {mixed}
     */

    getValue: {
        value: function (object, path) {
            var elements = this.transform(path),
                prop = elements.shift(),
                refl = new ReflectionObject(object),
                fromGetter = false,
                value,
                method;

            if (!this.disableGetterSetter) {
                for (var i = 0, l = this.prefixes.length; i < l; i++) {
                    method = this.prefixes[i] + this.camelize(prop);

                    if (refl.hasMethod(method)) {
                        value = refl.getMethod(method).call();
                        fromGetter = true;
                        break;
                    }
                }

                if (!fromGetter && refl.hasMethod('get')) {
                    value = refl.getMethod('get').call(prop);
                    fromGetter = true;
                }
            }

            if (!fromGetter && refl.hasProperty(prop)) {
                value = refl.getProperty(prop).getValue();
            } else if (!fromGetter) {
                return undefined;
            }

            if (elements.length === 0) {
                return value;
            }

            return this.getValue(value, elements);
        }
    },

    /**
     * Access the specified path in the object and change the value to the one specified
     *
     * @param {Object} object
     * @param {String} path
     * @param {mixed} value
     *
     * @return {Sy.PropertyAccessor} self
     */

    setValue: {
        value: function (object, path, value) {
            var elements = this.transform(path),
                prop = elements.pop(),
                refl,
                method;

            if (elements.length !== 0) {
                object = this.getValue(object, elements);
            }

            if (typeof object === 'undefined') {
                throw new ReferenceError('Path "' + path + '" not writable');
            }

            if (!this.disableGetterSetter) {
                method = 'set' + this.camelize(prop);
                refl = new ReflectionObject(object);

                if (refl.hasMethod(method)) {
                    refl.getMethod(method).call(value);
                    return this;
                }
            }

            object[prop] = value;

            return this;
        }
    },

    /**
     * Transform a path string into an array of its elements
     *
     * @param {String|Array} path
     *
     * @return {Array}
     */

    transform: {
        value: function (path) {
            if (path instanceof Array) {
                return path;
            }

            if (typeof path !== 'string' || path.trim() === '') {
                throw new TypeError('Invalid path');
            }

            return path.split('.');
        }
    },

    /**
     * Camelize a string
     *
     * @param {String} string
     *
     * @return {String}
     */

    camelize: {
        value: function (string) {
            var pieces = string.split('_');

            pieces.forEach(function (el, id) {
                this[id] = el.substr(0, 1).toUpperCase() + el.substr(1);
            }, pieces);

            return pieces.join('');
        }
    },

    /**
     * Activate the use of getters/setters
     *
     * @return {Sy.PropertyAccessor} self
     */

    enableSetterGetter: {
        value: function () {
            this.disableGetterSetter = false;

            return this;
        }
    },

    /**
     * Deactivate the use of getters/setters
     *
     * @return {Sy.PropertyAccessor} self
     */

    disableSetterGetter: {
        value: function () {
            this.disableGetterSetter = true;

            return this;
        }
    }

});
