namespace('Sy.ServiceContainer');

/**
 * Service container
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Core = function () {
    this.initialized = {};
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
                var filtered = this.services[id].getTag(tag);

                if (filtered.length > 0) {
                    matched.push({id: id, tags: filtered});
                }
            }, this);

            return matched;
        }
    }

});
