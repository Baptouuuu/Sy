/*! sy#0.5.0 - 2014-04-12 */function namespace(ns) {
    var namespaces = null, referer = this;
    if ("string" == typeof ns) namespaces = ns.split("."); else {
        if (!(ns instanceof Array && ns.length > 0)) return referer;
        namespaces = ns;
    }
    return referer[namespaces[0]] = referer[namespaces[0]] || {}, ns = namespaces.shift(), 
    namespace.call(referer[ns], namespaces);
}

function objectSetter(ns, value) {
    var namespaces = "", attr = "", referer = this, idx = ns.lastIndexOf(".");
    idx >= 0 ? (attr = ns.substr(idx + 1), namespaces = ns.substr(0, idx), referer = namespace.call(referer, namespaces)) : attr = ns, 
    referer[attr] = value;
}

function objectGetter(ns) {
    var namespaces = null, referer = this;
    if ("string" == typeof ns) {
        if (namespaces = ns.split("."), 1 === namespaces.length) return referer[ns];
    } else {
        if (!(ns instanceof Array && ns.length > 1)) return ns instanceof Array && 1 === ns.length ? referer[ns[0]] : void 0;
        namespaces = ns;
    }
    return ns = namespaces.shift(), objectGetter.call(referer[ns], namespaces);
}

function capitalize(string) {
    return string.substr(0, 1).toUpperCase() + string.substr(1);
}

function reflectedObjectGetter(ns) {
    var namespaces = null, referer = this;
    if ("string" == typeof ns) {
        if (namespaces = ns.split("."), 1 === namespaces.length) return getReflectedValue.call(referer, ns);
    } else {
        if (!(ns instanceof Array && ns.length > 1)) return ns instanceof Array && 1 === ns.length ? getReflectedValue.call(referer, ns[0]) : void 0;
        namespaces = ns;
    }
    return ns = namespaces.shift(), reflectedObjectGetter.call(getReflectedValue.call(referer, ns), namespaces);
}

function getReflectedValue(property) {
    var referer = new ReflectionObject(this);
    return referer.hasMethod("get" + capitalize(property)) ? referer.getMethod("get" + capitalize(property)).call() : referer.hasMethod("get") ? referer.getMethod("get").call(property) : referer.hasProperty(property) ? referer.getProperty(property).getValue() : void 0;
}

namespace("Sy"), Sy.ConfiguratorInterface = function() {
    this.name = "";
}, Sy.ConfiguratorInterface.prototype = Object.create(Object.prototype, {
    set: {
        value: function() {
            return this;
        }
    },
    get: {
        value: function() {
            return value;
        }
    },
    has: {
        value: function() {}
    },
    setName: {
        value: function(name) {
            return this.name = name, this;
        }
    },
    getName: {
        value: function() {
            return this.name;
        }
    }
}), namespace("Sy"), Sy.ControllerInterface = function() {
    this.container = {}, this.mediator = {};
}, Sy.ControllerInterface.prototype = Object.create(Object.prototype, {
    listen: {
        value: function() {}
    },
    broadcast: {
        value: function() {}
    },
    "new": {
        value: function() {}
    },
    sleep: {
        value: function() {}
    },
    wakeup: {
        value: function() {}
    },
    destroy: {
        value: function() {}
    },
    setMediator: {
        value: function() {}
    },
    setServiceContainer: {
        value: function() {}
    },
    setBundle: {
        value: function() {}
    },
    setViewScreen: {
        value: function() {}
    },
    init: {
        value: function() {}
    }
}), namespace("Sy"), Sy.EntityInterface = function() {}, Sy.EntityInterface.prototype = Object.create(Object.prototype, {
    set: {
        value: function() {
            return this;
        }
    },
    get: {
        value: function() {}
    },
    register: {
        value: function() {}
    },
    lock: {
        value: function() {}
    }
}), namespace("Sy"), Sy.FactoryInterface = function() {}, Sy.FactoryInterface.prototype = Object.create(Object.prototype, {
    make: {
        value: function() {}
    }
}), namespace("Sy.HTTP"), Sy.HTTP.RequestInterface = function() {}, Sy.HTTP.RequestInterface.prototype = Object.create(Object.prototype, {
    setURI: {
        value: function() {}
    },
    getURI: {
        value: function() {}
    },
    setMethod: {
        value: function() {}
    },
    getMethod: {
        value: function() {}
    },
    setData: {
        value: function() {}
    },
    getData: {
        value: function() {}
    },
    setHeader: {
        value: function() {}
    },
    getHeader: {
        value: function() {}
    },
    setListener: {
        value: function() {}
    },
    getListener: {
        value: function() {}
    },
    setType: {
        value: function() {}
    },
    getType: {
        value: function() {}
    }
}), namespace("Sy.HTTP"), Sy.HTTP.ResponseInterface = function() {}, Sy.HTTP.ResponseInterface.prototype = Object.create(Object.prototype, {
    HTTP_CONTINUE: {
        value: 100,
        writable: !1
    },
    HTTP_SWITCHING_PROTOCOLS: {
        value: 101,
        writable: !1
    },
    HTTP_PROCESSING: {
        value: 102,
        writable: !1
    },
    HTTP_OK: {
        value: 200,
        writable: !1
    },
    HTTP_CREATED: {
        value: 201,
        writable: !1
    },
    HTTP_ACCEPTED: {
        value: 202,
        writable: !1
    },
    HTTP_NON_AUTHORITATIVE_INFORMATION: {
        value: 203,
        writable: !1
    },
    HTTP_NO_CONTENT: {
        value: 204,
        writable: !1
    },
    HTTP_RESET_CONTENT: {
        value: 205,
        writable: !1
    },
    HTTP_PARTIAL_CONTENT: {
        value: 206,
        writable: !1
    },
    HTTP_MULTI_STATUS: {
        value: 207,
        writable: !1
    },
    HTTP_ALREADY_REPORTED: {
        value: 208,
        writable: !1
    },
    HTTP_IM_USED: {
        value: 226,
        writable: !1
    },
    HTTP_MULTIPLE_CHOICES: {
        value: 300,
        writable: !1
    },
    HTTP_MOVED_PERMANENTLY: {
        value: 301,
        writable: !1
    },
    HTTP_FOUND: {
        value: 302,
        writable: !1
    },
    HTTP_SEE_OTHER: {
        value: 303,
        writable: !1
    },
    HTTP_NOT_MODIFIED: {
        value: 304,
        writable: !1
    },
    HTTP_USE_PROXY: {
        value: 305,
        writable: !1
    },
    HTTP_RESERVED: {
        value: 306,
        writable: !1
    },
    HTTP_TEMPORARY_REDIRECT: {
        value: 307,
        writable: !1
    },
    HTTP_PERMANENTLY_REDIRECT: {
        value: 308,
        writable: !1
    },
    HTTP_BAD_REQUEST: {
        value: 400,
        writable: !1
    },
    HTTP_UNAUTHORIZED: {
        value: 401,
        writable: !1
    },
    HTTP_PAYMENT_REQUIRED: {
        value: 402,
        writable: !1
    },
    HTTP_FORBIDDEN: {
        value: 403,
        writable: !1
    },
    HTTP_NOT_FOUND: {
        value: 404,
        writable: !1
    },
    HTTP_METHOD_NOT_ALLOWED: {
        value: 405,
        writable: !1
    },
    HTTP_NOT_ACCEPTABLE: {
        value: 406,
        writable: !1
    },
    HTTP_PROXY_AUTHENTICATION_REQUIRED: {
        value: 407,
        writable: !1
    },
    HTTP_REQUEST_TIMEOUT: {
        value: 408,
        writable: !1
    },
    HTTP_CONFLICT: {
        value: 409,
        writable: !1
    },
    HTTP_GONE: {
        value: 410,
        writable: !1
    },
    HTTP_LENGTH_REQUIRED: {
        value: 411,
        writable: !1
    },
    HTTP_PRECONDITION_FAILED: {
        value: 412,
        writable: !1
    },
    HTTP_REQUEST_ENTITY_TOO_LARGE: {
        value: 413,
        writable: !1
    },
    HTTP_REQUEST_URI_TOO_LONG: {
        value: 414,
        writable: !1
    },
    HTTP_UNSUPPORTED_MEDIA_TYPE: {
        value: 415,
        writable: !1
    },
    HTTP_REQUESTED_RANGE_NOT_SATISFIABLE: {
        value: 416,
        writable: !1
    },
    HTTP_EXPECTATION_FAILED: {
        value: 417,
        writable: !1
    },
    HTTP_I_AM_TEAPOT: {
        value: 418,
        writable: !1
    },
    HTTP_UNPROCESSABLE_ENTITY: {
        value: 422,
        writable: !1
    },
    HTTP_LOCKED: {
        value: 423,
        writable: !1
    },
    HTTP_FAILED_DEPENDENCY: {
        value: 424,
        writable: !1
    },
    HTTP_RESERVED_FOR_WEBDAV_ADVANCED_COLLECTIONS_EXPIRED_PROPOSAL: {
        value: 425,
        writable: !1
    },
    HTTP_UPGRADE_REQUIRED: {
        value: 426,
        writable: !1
    },
    HTTP_PRECONDITION_REQURED: {
        value: 428,
        writable: !1
    },
    HTTP_TOO_MANY_REQUESTS: {
        value: 429,
        writable: !1
    },
    HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE: {
        value: 431,
        writable: !1
    },
    HTTP_INTERNAL_SERVOR_ERROR: {
        value: 500,
        writable: !1
    },
    HTTP_NOT_IMPLEMENTED: {
        value: 501,
        writable: !1
    },
    HTTP_BAD_GATEWAY: {
        value: 502,
        writable: !1
    },
    HTTP_SERVICE_UNAVAILABLE: {
        value: 503,
        writable: !1
    },
    HTTP_GATEWAY_TIMEOUT: {
        value: 504,
        writable: !1
    },
    HTTP_VERSION_NOT_SUPPORTED: {
        value: 505,
        writable: !1
    },
    HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL: {
        value: 506,
        writable: !1
    },
    HTTP_INSUFFICIENT_STORAGE: {
        value: 507,
        writable: !1
    },
    HTTP_LOOP_DETECTED: {
        value: 508,
        writable: !1
    },
    HTTP_NOT_EXTENDED: {
        value: 510,
        writable: !1
    },
    HTTP_NETWORK_AUTHENTICATION_REQUIRED: {
        value: 511,
        writable: !1
    },
    setStatusCode: {
        value: function() {}
    },
    getStatusCode: {
        value: function() {}
    },
    setStatusText: {
        value: function() {}
    },
    getStatusText: {
        value: function() {}
    },
    setHeaders: {
        value: function() {}
    },
    getHeader: {
        value: function() {}
    },
    setBody: {
        value: function() {}
    },
    getBody: {
        value: function() {}
    }
}), namespace("Sy.Lib.Generator"), Sy.Lib.Generator.Interface = function() {}, Sy.Lib.Generator.Interface.prototype = Object.create(Object.prototype, {
    generate: {
        value: function() {}
    }
}), namespace("Sy.Lib.Logger.Handler"), Sy.Lib.Logger.Handler.Interface = function() {}, 
Sy.Lib.Logger.Handler.Interface.prototype = Object.create(Object.prototype, {
    handle: {
        value: function() {}
    },
    isHandling: {
        value: function() {}
    }
}), namespace("Sy.Lib.Logger"), Sy.Lib.Logger.Interface = function() {}, Sy.Lib.Logger.Interface.prototype = Object.create(Object.prototype, {
    LOG: {
        value: "log",
        writable: !1
    },
    DEBUG: {
        value: "debug",
        writable: !1
    },
    ERROR: {
        value: "error",
        writable: !1
    },
    INFO: {
        value: "info",
        writable: !1
    },
    setName: {
        value: function() {
            return this;
        }
    },
    log: {
        value: function() {
            return this;
        }
    },
    debug: {
        value: function() {
            return this;
        }
    },
    error: {
        value: function() {
            return this;
        }
    },
    info: {
        value: function() {
            return this;
        }
    },
    setHandler: {
        value: function() {
            return this;
        }
    },
    isHandlingLevel: {
        value: function() {}
    },
    removeHandler: {
        value: function() {}
    },
    lock: {
        value: function() {}
    }
}), namespace("Sy"), Sy.StateRegistryInterface = function() {}, Sy.StateRegistryInterface.prototype = Object.create(Object.prototype, {
    set: {
        value: function() {}
    },
    has: {
        value: function() {}
    },
    get: {
        value: function() {}
    },
    state: {
        value: function() {}
    },
    remove: {
        value: function() {}
    }
}), namespace("Sy"), Sy.RegistryInterface = function() {}, Sy.RegistryInterface.prototype = Object.create(Object.prototype, {
    set: {
        value: function() {}
    },
    has: {
        value: function() {}
    },
    get: {
        value: function() {}
    },
    getMapping: {
        value: function() {}
    },
    remove: {
        value: function() {}
    },
    length: {
        value: function() {}
    }
}), namespace("Sy"), Sy.ServiceContainerInterface = function() {}, Sy.ServiceContainerInterface.prototype = Object.create(Object.prototype, {
    setParameters: {
        value: function() {
            return this;
        }
    },
    getParameter: {
        value: function() {}
    },
    setName: {
        value: function() {
            return this;
        }
    },
    getName: {
        value: function() {}
    },
    set: {
        value: function() {
            return this;
        }
    },
    get: {
        value: function() {}
    },
    has: {
        value: function() {}
    }
}), namespace("Sy.Storage"), Sy.Storage.RepositoryInterface = function() {}, Sy.Storage.RepositoryInterface.prototype = Object.create(Object.prototype, {
    setUnitOfWork: {
        value: function() {}
    },
    setCacheRegistry: {
        value: function() {}
    },
    setName: {
        value: function() {}
    },
    setEngine: {
        value: function() {}
    },
    setEntityKey: {
        value: function() {}
    },
    setEntityConstructor: {
        value: function() {}
    },
    setIndexes: {
        value: function() {}
    },
    setGenerator: {
        value: function() {}
    },
    persist: {
        value: function() {}
    },
    remove: {
        value: function() {}
    },
    flush: {
        value: function() {}
    },
    findOneBy: {
        value: function() {}
    },
    findBy: {
        value: function() {}
    }
}), namespace("Sy.Storage"), Sy.Storage.EngineInterface = function() {}, Sy.Storage.EngineInterface.prototype = Object.create(Object.prototype, {
    setStore: {
        value: function() {}
    },
    read: {
        value: function() {}
    },
    create: {
        value: function() {}
    },
    update: {
        value: function() {}
    },
    remove: {
        value: function() {}
    },
    find: {
        value: function() {}
    }
}), namespace("Sy.Storage"), Sy.Storage.StoreMapperInterface = function() {}, Sy.Storage.StoreMapperInterface.prototype = Object.create(Object.prototype, {
    transform: {
        value: function() {}
    }
}), namespace("Sy.View"), Sy.View.LayoutFactoryInterface = function() {}, Sy.View.LayoutFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setParser: {
        value: function() {}
    },
    setTemplateEngine: {
        value: function() {}
    },
    setRegistryFactory: {
        value: function() {}
    },
    setListFactory: {
        value: function() {}
    }
}), namespace("Sy.View"), Sy.View.ListFactoryInterface = function() {}, Sy.View.ListFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setTemplateEngine: {
        value: function() {}
    }
}), namespace("Sy.View"), Sy.View.TemplateEngineInterface = function() {}, Sy.View.TemplateEngineInterface.prototype = Object.create(Object.prototype, {
    PATTERN: {
        value: new RegExp(/{{\s?([\w.]+)\s?}}/gim),
        writable: !1,
        configurable: !1
    },
    render: {
        value: function() {}
    }
}), namespace("Sy.View"), Sy.View.ViewScreenFactoryInterface = function() {}, Sy.View.ViewScreenFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setParser: {
        value: function() {}
    },
    setTemplateEngine: {
        value: function() {}
    },
    setRegistryFactory: {
        value: function() {}
    },
    setLayoutFactory: {
        value: function() {}
    },
    setViewScreenWrapper: {
        value: function() {}
    }
}), namespace("Sy.Kernel"), Sy.Kernel.ActionBinder = function() {
    this.mediator = null, this.controllers = [];
}, Sy.Kernel.ActionBinder.prototype = Object.create(Object.prototype, {
    setMediator: {
        value: function(mediator) {
            if (!(mediator instanceof Sy.Lib.Mediator)) throw new TypeError("Invalid mediator");
            return this.mediator = mediator, this;
        }
    },
    bind: {
        value: function(controller, viewscreen) {
            if (!(controller instanceof Sy.ControllerInterface)) throw new TypeError("Invalid controller");
            if (!(viewscreen instanceof Sy.View.ViewScreen)) throw new TypeError("Invalid viewscreen");
            for (var actionNode, action, events, node = viewscreen.getNode(), actions = node.querySelectorAll("[data-sy-action]"), refl = new ReflectionObject(controller), i = 0, l = actions.length; l > i; i++) {
                if (actionNode = actions[i], action = actionNode.dataset.syAction.split("|")[0] + "Action", 
                !refl.hasMethod(action)) throw new ReferenceError('Undefined method "' + action + '"');
                actionNode.dataset.syControllerIndex = this.controllers.push(controller) - 1, actionNode.dataset.syActionName = action, 
                events = actionNode.dataset.syAction.split("|"), events.splice(0, 1);
                for (var j = 0, jl = events.length; jl > j; j++) actionNode.addEventListener(events[j], this.eventCallback.bind(this), !1);
            }
        }
    },
    eventCallback: {
        value: function(event) {
            var target = event.currentTarget, controller = this.controllers[target.dataset.syControllerIndex], action = target.dataset.syActionName;
            this.mediator.publish("controller::on::pre::action", controller, action), controller[action].call(controller, event), 
            this.mediator.publish("controller::on::pre::action", controller, action);
        }
    }
}), namespace("Sy.Kernel"), Sy.Kernel.AppParser = function() {
    this.bundles = [], this.controllers = [], this.entities = [], this.viewscreens = [], 
    this.services = [];
}, Sy.Kernel.AppParser.prototype = Object.create(Object.prototype, {
    getBundles: {
        value: function() {
            if (this.bundles.length > 0 || !objectGetter("App.Bundle")) return this.bundles;
            for (var bundle in App.Bundle) App.Bundle.hasOwnProperty(bundle) && this.bundles.push(bundle);
            return this.bundles;
        }
    },
    getControllers: {
        value: function() {
            if (this.controllers.length > 0) return this.controllers;
            for (var bundleCtrl, i = 0, l = this.bundles.length; l > i; i++) if (bundleCtrl = App.Bundle[this.bundles[i]].Controller) for (var ctrl in bundleCtrl) bundleCtrl.hasOwnProperty(ctrl) && this.controllers.push({
                name: this.bundles[i] + "::" + ctrl,
                creator: bundleCtrl[ctrl]
            });
            return this.controllers;
        }
    },
    getEntities: {
        value: function() {
            if (this.entities.length > 0) return this.entities;
            for (var bundleEntities, bundleRepositories, alias, entity, i = 0, l = this.bundles.length; l > i; i++) if (bundleEntities = App.Bundle[this.bundles[i]].Entity, 
            bundleRepositories = App.Bundle[this.bundles[i]].Repository || {}, bundleEntities) for (var name in bundleEntities) bundleEntities.hasOwnProperty(name) && (alias = this.bundles[i] + "::" + name, 
            entity = bundleEntities[name], this.entities.push({
                name: alias,
                repository: bundleRepositories[name] || Sy.Storage.Repository,
                entity: entity,
                indexes: new entity().indexes,
                uuid: entity.prototype.UUID
            }));
            return this.entities;
        }
    },
    getViewScreens: {
        value: function() {
            if (this.viewscreens.length > 0) return this.viewscreens;
            for (var bundleViewScreens, i = 0, l = this.bundles.length; l > i; i++) if (bundleViewScreens = App.Bundle[this.bundles[i]].ViewScreen) for (var name in bundleViewScreens) bundleViewScreens.hasOwnProperty(name) && this.viewscreens.push({
                name: this.bundles[i] + "::" + name,
                creator: bundleViewScreens[name]
            });
            return this.viewscreens;
        }
    },
    getServices: {
        value: function() {
            if (this.services.length > 0) return this.services;
            for (var bundleConfig, i = 0, l = this.bundles.length; l > i; i++) bundleConfig = App.Bundle[this.bundles[i]].Config, 
            bundleConfig && bundleConfig.Service && (bundleConfig = new bundleConfig.Service(), 
            this.services = this.services.concat(bundleConfig.define()));
            return this.services;
        }
    }
}), namespace("Sy.Kernel"), Sy.Kernel.ControllerManager = function() {
    this.meta = null, this.loaded = null, this.mediator = null, this.container = null, 
    this.current = null, this.cache = null, this.cacheLength = null, this.cacheOrder = [], 
    this.actionBinder = null;
}, Sy.Kernel.ControllerManager.prototype = Object.create(Object.prototype, {
    setMetaRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.meta = registry, this;
        }
    },
    setLoadedControllersRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.loaded = registry, this;
        }
    },
    registerController: {
        value: function(alias, constructor) {
            if (!(constructor.prototype instanceof Sy.ControllerInterface)) throw new TypeError("Invalid controller constructor");
            return this.meta.set(alias, constructor), this;
        }
    },
    setMediator: {
        value: function(mediator) {
            if (!(mediator instanceof Sy.Lib.Mediator)) throw new TypeError("Invalid mediator");
            return this.mediator = mediator, this;
        }
    },
    setServiceContainer: {
        value: function(container) {
            if (!(container instanceof Sy.ServiceContainerInterface)) throw new TypeError("Invalid service container");
            return this.container = container, this;
        }
    },
    setCache: {
        value: function(cache) {
            return this.cache = !!cache, this;
        }
    },
    setCacheLength: {
        value: function(length) {
            return this.cacheLength = length, this;
        }
    },
    setActionBinder: {
        value: function(binder) {
            if (!(binder instanceof Sy.Kernel.ActionBinder)) throw new TypeError("Invalid action binder");
            return this.actionBinder = binder, this;
        }
    },
    onDisplayListener: {
        value: function(viewscreen) {
            var instance, bundleName, ctrl = viewscreen.getNode().dataset.syController;
            if (this.loaded.has(ctrl)) this.current !== ctrl && (this.loaded.get(this.current).sleep(), 
            this.loaded.get(ctrl).wakeup(), this.current = ctrl); else {
                if (!this.meta.has(ctrl)) throw new ReferenceError('The controller with the alias "' + ctrl + '" is undefined');
                bundleName = ctrl.split("::")[0], instance = new (this.meta.get(ctrl))(), instance.setBundle(bundleName).setMediator(this.mediator).setServiceContainer(this.container).setViewScreen(viewscreen).init(), 
                this.cacheController(ctrl, instance), this.actionBinder.bind(instance, viewscreen), 
                this.current = ctrl;
            }
        }
    },
    cacheController: {
        value: function(alias, instance) {
            return this.loaded.set(alias, instance), this.cacheOrder.push(alias), (this.cache === !1 || this.cache === !0 && "number" == typeof this.cacheLength && this.loaded.length() > this.cacheLength) && (this.loaded.get(this.cacheOrder[0]).destroy(), 
            this.loaded.remove(this.cacheOrder[0]), this.cacheOrder.splice(0, 1)), this;
        }
    },
    boot: {
        value: function() {
            this.mediator.subscribe({
                channel: "view::on::pre::display",
                fn: this.onDisplayListener,
                context: this
            });
        }
    }
}), namespace("Sy.Kernel"), Sy.Kernel.Core = function() {
    this.config = new Sy.Configurator(), this.container = new Sy.ServiceContainer("sy::core"), 
    this.controllerManager = new Sy.Kernel.ControllerManager(), this.actionBinder = new Sy.Kernel.ActionBinder();
}, Sy.Kernel.Core.prototype = Object.create(Object.prototype, {
    getConfig: {
        value: function() {
            return this.config;
        }
    },
    getServiceContainer: {
        value: function() {
            return this.container;
        }
    },
    boot: {
        value: function() {
            var tester = new Sy.Kernel.FeatureTester(), parser = new Sy.Kernel.AppParser();
            tester.testBrowser(), this.config.set("parameters.app.meta", {
                bundles: parser.getBundles(),
                controllers: parser.getControllers(),
                entities: parser.getEntities(),
                viewscreens: parser.getViewScreens()
            }), this.registerServices(parser.getServices()).registerControllers(parser.getControllers()).configureLogger().registerShutdownListener();
        }
    },
    registerServices: {
        value: function(services) {
            for (var i = 0, l = services.length; l > i; i++) if (services[i].creator) this.container.set(services[i].name, services[i].creator); else if ("string" == typeof services[i].constructor) {
                var def = {}, name = services[i].name;
                delete services[i].name, def[name] = services[i], this.container.set(def);
            }
            return this;
        }
    },
    registerControllers: {
        value: function(controllers) {
            var registryFactory = this.container.get("sy::core::registry::factory"), mediator = this.container.get("sy::core::mediator");
            this.actionBinder.setMediator(mediator), this.controllerManager.setMetaRegistry(registryFactory.make()).setLoadedControllersRegistry(registryFactory.make()).setMediator(mediator).setServiceContainer(this.container).setCache(this.config.get("controllers.cache")).setCacheLength(this.config.get("controllers.cacheLength")).setActionBinder(this.actionBinder);
            for (var i = 0, l = controllers.length; l > i; i++) this.controllerManager.registerController(controllers[i].name, controllers[i].creator);
            return this.controllerManager.boot(), this;
        }
    },
    configureLogger: {
        value: function() {
            var env = this.config.get("env"), logger = this.container.get("sy::core::logger");
            return "prod" === env && logger.removeHandler(logger.LOG).removeHandler(logger.DEBUG).removeHandler(logger.INFO), 
            this;
        }
    },
    registerShutdownListener: {
        value: function() {
            return window.addEventListener("beforeunload", function(event) {
                try {
                    this.container.get("sy::core::mediator").publish("app::shutdown", event);
                } catch (error) {
                    return error.message;
                }
            }.bind(this), !1), this;
        }
    }
}), namespace("Sy.Kernel"), Sy.Kernel.FeatureTester = function() {}, Sy.Kernel.FeatureTester.prototype = Object.create(Object.prototype, {
    testJSON: {
        value: function() {
            if ("object" != typeof JSON) throw new ReferenceError("JSON is not supported");
            if ("function" != typeof JSON.parse || "function" != typeof JSON.stringify) throw new ReferenceError("JSON methods are not defined");
        }
    },
    testXHR: {
        value: function() {
            if ("function" != typeof XMLHttpRequest) throw new ReferenceError("XMLHttpRequest is not defined");
            if ("function" != typeof FormData) throw new ReferenceError("FormData is not defined");
        }
    },
    testBind: {
        value: function() {
            if ("function" != typeof Function.prototype.bind) throw new ReferenceError("The Function.bind method is not defined");
        }
    },
    testHTMLAttributes: {
        value: function() {
            if (!(document.body.dataset instanceof DOMStringMap)) throw new ReferenceError("Element dataset not supported");
            if (!(document.body.attributes instanceof NamedNodeMap)) throw new ReferenceError("Element.attributes not defined");
        }
    },
    testEventListener: {
        value: function() {
            if ("function" != typeof document.body.addEventListener) throw new ReferenceError("Element.addEventListener is not defined");
        }
    },
    testBrowser: {
        value: function() {
            this.testJSON(), this.testXHR(), this.testHTMLAttributes(), this.testBind(), this.testEventListener();
        }
    }
}), namespace("Sy.Lib.Generator"), Sy.Lib.Generator.UUID = function() {}, Sy.Lib.Generator.UUID.prototype = Object.create(Sy.Lib.Generator.Interface.prototype, {
    s4: {
        value: function() {
            return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
        }
    },
    generate: {
        value: function() {
            return this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + this.s4() + this.s4();
        }
    }
}), namespace("Sy.Lib.Logger"), Sy.Lib.Logger.CoreLogger = function(name) {
    this.name = "", this.handlers = {}, this.setName(name);
}, Sy.Lib.Logger.CoreLogger.prototype = Object.create(Sy.Lib.Logger.Interface.prototype, {
    setName: {
        value: function(name) {
            return this.name = name || "null", this;
        }
    },
    setHandler: {
        value: function(handler, level) {
            return handler instanceof Sy.Lib.Logger.Handler.Interface && level.toUpperCase() in this && (this.handlers[level] = handler), 
            this;
        }
    },
    isHandlingLevel: {
        value: function(level) {
            return !!this.handlers[level];
        }
    },
    removeHandler: {
        value: function(level) {
            return this.isHandlingLevel(level) && delete this.handlers[level], this;
        }
    },
    handle: {
        value: function(level, message, data) {
            return this.handlers[level] && this.handlers[level].handle(this.name, level, message, data), 
            this;
        }
    },
    log: {
        value: function(message, data) {
            return this.handle(this.LOG, message, data), this;
        }
    },
    debug: {
        value: function(message, data) {
            return this.handle(this.DEBUG, message, data), this;
        }
    },
    error: {
        value: function(message, data) {
            return this.handle(this.ERROR, message, data), this;
        }
    },
    info: {
        value: function(message, data) {
            return this.handle(this.INFO, message, data), this;
        }
    },
    lock: {
        value: function() {
            return Object.seal(this.handlers), this;
        }
    }
}), namespace("Sy.Lib.Logger.Handler"), Sy.Lib.Logger.Handler.Console = function(level) {
    this.level = null, this.setLevel(level);
}, Sy.Lib.Logger.Handler.Console.prototype = Object.create(Sy.Lib.Logger.Handler.Interface.prototype, {
    setLevel: {
        value: function(level) {
            if (!this.checkLevel(level)) throw new TypeError("Unknown logger level");
            return this.level = level, this;
        }
    },
    checkLevel: {
        value: function(level) {
            return level.toUpperCase() in Sy.Lib.Logger.Interface.prototype ? !0 : !1;
        }
    },
    isHandling: {
        value: function(level) {
            return level === this.level ? !0 : !1;
        }
    },
    handle: {
        value: function(name, level, message, data) {
            if (this.isHandling(level) && "console" in window) {
                var output = "[" + moment().format("YYYY-M-D hh:mm:ss") + "]", extra = data || [];
                message = message || "", output += " " + name + "." + level.toUpperCase(), output += " " + message.toString(), 
                console[level](output, extra);
            }
            return this;
        }
    }
}), namespace("Sy.Lib"), Sy.Lib.Mediator = function() {
    this.channels = {}, this.generator = null, this.logger = null;
}, Sy.Lib.Mediator.prototype = Object.create(Object.prototype, {
    subscribe: {
        value: function(options) {
            var options = options || {}, channel = null;
            return void 0 === options.priority && (options.priority = 1), void 0 === this.channels[options.channel] && (channel = new Sy.Lib.MediatorChannel(options.channel), 
            channel.setGenerator(this.generator), this.logger && channel.setLogger(this.logger), 
            this.channels[options.channel] = channel), this.channels[options.channel].add(options.fn, options.context, options.priority, options.async, options.bubbles);
        }
    },
    remove: {
        value: function(channel, id) {
            return void 0 !== this.channels[channel] && this.channels[channel].remove(id), this;
        }
    },
    publish: {
        value: function() {
            if (0 === arguments.length) return this;
            var channel = Array.prototype.slice.call(arguments, 0, 1)[0], args = Array.prototype.slice.call(arguments, 1);
            return void 0 !== this.channels[channel] && this.channels[channel].publish(args), 
            this;
        }
    },
    pause: {
        value: function(channel, subscriber) {
            return void 0 !== this.channels[channel] && (this.channels[channel].stopped = !0, 
            subscriber && this.channels[channel].pause(subscriber)), this;
        }
    },
    unpause: {
        value: function(channel, subscriber) {
            return void 0 !== this.channels[channel] && (this.channels[channel].stopped = !1, 
            subscriber && this.channels[channel].unpause(subscriber)), this;
        }
    },
    paused: {
        value: function(channel) {
            return void 0 !== this.channels[channel] ? this.channels[channel].stopped : void 0;
        }
    },
    setGenerator: {
        value: function(object) {
            if (!(object instanceof Sy.Lib.Generator.Interface)) throw new TypeError("Invalid generator");
            return this.generator = object, this;
        }
    },
    setLogger: {
        value: function(object) {
            if (!(object instanceof Sy.Lib.Logger.Interface)) throw new TypeError("Invalid logger");
            return this.logger = object, this;
        }
    }
}), Sy.Lib.MediatorChannel = function(name) {
    this.name = name || "", this.stopped = !1, this.subscribers = {}, this.generator = null, 
    this.logger = null;
}, Sy.Lib.MediatorChannel.prototype = Object.create(Object.prototype, {
    add: {
        value: function(fn, context, priority, async, bubbles) {
            var guid = this.generator.generate();
            return this.subscribers[guid] = {
                fn: fn,
                context: context || window,
                priority: priority || 1,
                async: !!async,
                bubbles: !!bubbles,
                stopped: !1
            }, guid;
        }
    },
    remove: {
        value: function(id) {
            return delete this.subscribers[id], this;
        }
    },
    publish: {
        value: function(args) {
            var args = args || [];
            if (this.stopped === !1) {
                var fns = [];
                for (var s in this.subscribers) this.subscribers.hasOwnProperty(s) && this.subscribers[s].stopped === !1 && fns.push(this.subscribers[s]);
                fns.sort(function(a, b) {
                    return a.priority - b.priority;
                });
                for (var i = 0, l = fns.length; l > i; i++) try {
                    var subscriber = fns[i];
                    subscriber.async === !0 ? setTimeout(this.subscriberCall, 0, this, subscriber.fn, subscriber.context, args) : this.subscriberCall(this, subscriber.fn, subscriber.context, args);
                } catch (error) {
                    if (this.logger && this.logger.error(error.message, error), subscriber.bubbles === !0) throw error;
                }
            }
            return this;
        }
    },
    setGenerator: {
        value: function(object) {
            if (!(object instanceof Sy.Lib.Generator.Interface)) throw new TypeError("Invalid generator");
            return this.generator = object, this;
        }
    },
    setLogger: {
        value: function(object) {
            if (!(object instanceof Sy.Lib.Logger.Interface)) throw new TypeError("Invalid logger");
            return this.logger = object, this;
        }
    },
    subscriberCall: {
        value: function(self, fn, context, args) {
            fn.apply(context, args);
        }
    },
    pause: {
        value: function(id) {
            return this.subscribers[id] && (this.subscribers[id].stopped = !0), this;
        }
    },
    unpause: {
        value: function(id) {
            return this.subscribers[id] && (this.subscribers[id].stopped = !1), this;
        }
    }
}), namespace("Sy.HTTP"), Sy.HTTP.Request = function() {
    this.method = "GET", this.data = new Sy.Registry(), this.headers = new Sy.Registry(), 
    this.listener = null, this.type = "", this.uri = "";
}, Sy.HTTP.Request.prototype = Object.create(Sy.HTTP.RequestInterface.prototype, {
    setURI: {
        value: function(uri) {
            return this.uri = uri, this;
        }
    },
    getURI: {
        value: function() {
            return this.uri;
        }
    },
    setMethod: {
        value: function(method) {
            var m = method.toUpperCase();
            return -1 !== [ "OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT" ].indexOf(m) && (this.method = m), 
            this;
        }
    },
    getMethod: {
        value: function() {
            return this.method;
        }
    },
    setData: {
        value: function(data) {
            for (var k in data) data.hasOwnProperty(k) && this.data.set(k, data[k]);
            return this;
        }
    },
    getData: {
        value: function() {
            return this.data.getMapping();
        }
    },
    setHeader: {
        value: function(header, value) {
            if (header instanceof Object) for (var k in header) header.hasOwnProperty(k) && this.setHeader(k, header[k]); else "string" == typeof header && "string" == typeof value && this.headers.set(header, value);
            return this;
        }
    },
    getHeader: {
        value: function(header) {
            return void 0 !== header ? this.headers.has(header) ? this.headers.get(header) : void 0 : this.headers.getMapping();
        }
    },
    setListener: {
        value: function(fn) {
            return this.listener = fn, this;
        }
    },
    getListener: {
        value: function() {
            return this.listener;
        }
    },
    setType: {
        value: function(type) {
            return -1 !== [ "html", "json" ].indexOf(type) && (this.type = type), this;
        }
    },
    getType: {
        value: function() {
            return this.type;
        }
    }
}), namespace("Sy.HTTP"), Sy.HTTP.Response = function() {
    this.statusCode = 0, this.statusText = null, this.headers = new Sy.Registry(), this.body = null;
}, Sy.HTTP.Response.prototype = Object.create(Sy.HTTP.ResponseInterface.prototype, {
    setStatusCode: {
        value: function(code) {
            return this.statusCode = parseInt(code, 10), this;
        }
    },
    getStatusCode: {
        value: function() {
            return this.statusCode;
        }
    },
    setStatusText: {
        value: function(message) {
            return this.statusText = message, this;
        }
    },
    getStatusText: {
        value: function() {
            return this.statusText;
        }
    },
    setHeaders: {
        value: function(headers) {
            for (var h in headers) headers.hasOwnProperty(h) && this.headers.set(h, headers[h]);
            return this;
        }
    },
    getHeader: {
        value: function(header) {
            return void 0 === header ? this.headers.getMapping() : this.headers.has(header) ? this.headers.get(header) : void 0;
        }
    },
    setBody: {
        value: function(body) {
            return this.body = body, this;
        }
    },
    getBody: {
        value: function() {
            return this.body;
        }
    }
}), namespace("Sy.HTTP"), Sy.HTTP.JSONRequest = function() {
    Sy.HTTP.Request.call(this), this.setType("json"), this.setHeader("Accept", "application/json");
}, Sy.HTTP.JSONRequest.prototype = Object.create(Sy.HTTP.Request.prototype), namespace("Sy.HTTP"), 
Sy.HTTP.JSONResponse = function() {
    Sy.HTTP.Response.call(this);
}, Sy.HTTP.JSONResponse.prototype = Object.create(Sy.HTTP.Response.prototype), namespace("Sy.HTTP"), 
Sy.HTTP.HeaderParser = function() {}, Sy.HTTP.HeaderParser.prototype = Object.create(Object.prototype, {
    parse: {
        value: function(headers) {
            for (var header, value, index, obj = {}, headersList = headers.split("\n"), i = 0, l = headersList.length - 1; l > i; i++) {
                switch (index = headersList[i].indexOf(":"), header = headersList[i].substring(0, index), 
                value = headersList[i].substring(index + 2), header) {
                  case "Date":
                  case "Expires":
                  case "Last-Modified":
                    value = new Date(value);
                }
                obj[header] = value;
            }
            return obj;
        }
    }
}), namespace("Sy.HTTP"), Sy.HTTP.HTMLRequest = function() {
    Sy.HTTP.Request.call(this), this.setType("html"), this.setHeader("Accept", "text/html,application/xhtml+xml");
}, Sy.HTTP.HTMLRequest.prototype = Object.create(Sy.HTTP.Request.prototype), namespace("Sy.HTTP"), 
Sy.HTTP.HTMLResponse = function() {
    Sy.HTTP.Response.call(this);
}, Sy.HTTP.HTMLResponse.prototype = Object.create(Sy.HTTP.Response.prototype), namespace("Sy.HTTP"), 
Sy.HTTP.Manager = function() {
    this.requests = null, this.parser = null, this.generator = null;
}, Sy.HTTP.Manager.prototype = Object.create(Object.prototype, {
    setParser: {
        value: function(parser) {
            return this.parser = parser, this;
        }
    },
    setGenerator: {
        value: function(generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) throw new TypeError("Invalid generator type");
            return this.generator = generator, this;
        }
    },
    setRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.Registry)) throw new TypeError("Invalid registry");
            return this.requests = registry, this;
        }
    },
    launch: {
        value: function(request) {
            if (!(request instanceof Sy.HTTP.RequestInterface)) throw new TypeError("Invalid request type");
            var uuid = this.generator.generate(), req = {
                xhr: null,
                obj: request,
                uuid: uuid
            }, headers = request.getHeader(), data = request.getData(), requestData = new FormData();
            switch (req.xhr = new XMLHttpRequest(), req.xhr.open(request.getMethod(), request.getURI()), 
            req.xhr.UUID = uuid, req.xhr.addEventListener("readystatechange", this.listener.bind(this), !1), 
            request.getType()) {
              case "html":
                req.xhr.responseType = "document";
                break;

              case "json":
                req.xhr.responseType = "json";
            }
            for (var header in headers) headers.hasOwnProperty(header) && req.xhr.setRequestHeader(header, headers[header]);
            for (var k in data) data.hasOwnProperty(k) && requestData.append(k, data[k]);
            return req.xhr.send(requestData), this.requests.set(uuid, req), uuid;
        }
    },
    listener: {
        value: function(event) {
            if (event.target.readyState === event.target.DONE && this.requests.has(event.target.UUID)) {
                var response, request = this.requests.get(event.target.UUID), lstn = request.obj.getListener(), headers = this.parser.parse(event.target.getAllResponseHeaders());
                response = -1 !== headers["Content-Type"].indexOf("application/json") && "json" === request.obj.getType() ? new Sy.HTTP.JSONResponse() : -1 !== headers["Content-Type"].indexOf("text/html") && "html" === request.obj.getType() ? new Sy.HTTP.HTMLResponse() : new Sy.HTTP.Response(), 
                response.setHeaders(headers), response.setStatusCode(event.target.status), response.setStatusText(event.target.statusText), 
                response.setBody(event.target.response), this.requests.remove(event.target.UUID), 
                void 0 !== lstn && lstn(response);
            }
        }
    },
    abort: {
        value: function(identifier) {
            var request = this.requests.get(identifier);
            return request.xhr.abort(), this.requests.remove(identifier), this;
        }
    }
}), namespace("Sy.HTTP"), Sy.HTTP.REST = function() {
    this.manager = null;
}, Sy.HTTP.REST.prototype = Object.create(Object.prototype, {
    setManager: {
        value: function(manager) {
            if (!(manager instanceof Sy.HTTP.Manager)) throw new TypeError("Invalid manager");
            return this.manager = manager, this;
        }
    },
    request: {
        value: function(args) {
            var request = new Sy.HTTP.JSONRequest();
            args.data = args.data || {}, args.headers = args.headers || {}, request.setMethod(args.method), 
            request.setURI(args.uri), request.setHeader(args.headers), request.setData(args.data), 
            request.setListener(args.listener), this.manager.launch(request);
        }
    },
    get: {
        value: function(args) {
            return args.method = "get", this.request(args), this;
        }
    },
    post: {
        value: function(args) {
            return args.method = "post", this.request(args), this;
        }
    },
    put: {
        value: function(args) {
            return args.method = "put", args.data = args.data || {
                _method: "put"
            }, this.request(args), this;
        }
    },
    remove: {
        value: function(args) {
            return args.method = "delete", args.data = args.data || {
                _method: "delete"
            }, this.request(args), this;
        }
    }
}), namespace("Sy.Storage"), Sy.Storage.Core = function() {
    this.managers = null;
}, Sy.Storage.Core.prototype = Object.create(Object.prototype, {
    setRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.Registry)) throw new TypeError("Invalid registry");
            return this.managers = new Sy.Registry(), this;
        }
    },
    setManager: {
        value: function(name, manager) {
            if (!(manager instanceof Sy.Storage.Manager)) throw new TypeError("Invalid manager type");
            return this.managers.set(name, manager), this;
        }
    },
    getManager: {
        value: function(manager) {
            return manager = manager || "main", this.managers.get(manager);
        }
    }
}), namespace("Sy.Storage.Engine"), Sy.Storage.Engine.IndexedDB = function(version) {
    this.version = version, this.connection = null, this.transaction = null, this.keyRange = null, 
    this.transactionModes = {
        READ_ONLY: null,
        READ_WRITE: null
    }, this.name = "app::storage", this.stores = {}, this.storage = null, this.logger = null, 
    this.mediator = null;
}, Sy.Storage.Engine.IndexedDB.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {
    setConnection: {
        value: function(connection) {
            if (!(connection instanceof IDBFactory)) throw new TypeError("Invalid connection");
            return this.connection = connection, this;
        }
    },
    setTransaction: {
        value: function(transaction) {
            return this.transaction = transaction, this.transactionModes = {
                READ_ONLY: this.transaction.READ_ONLY || "readonly",
                READ_WRITE: this.transaction.READ_WRITE || "readwrite"
            }, this;
        }
    },
    setKeyRange: {
        value: function(keyrange) {
            return this.keyRange = keyrange, this;
        }
    },
    setName: {
        value: function(name) {
            return this.name = name, this;
        }
    },
    setLogger: {
        value: function(logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) throw new TypeError("Invalid logger");
            return this.logger = logger, this;
        }
    },
    setMediator: {
        value: function(mediator) {
            return this.mediator = mediator, this;
        }
    },
    open: {
        value: function() {
            var request = this.connection.open(this.name, this.version);
            return request.onupgradeneeded = this.upgradeDatabase.bind(this), request.onsuccess = function(event) {
                this.storage = event.target.result, this.storage.onerror = function(event) {
                    this.logger.error("Database operation failed", event);
                }.bind(this), this.logger.info("Database opened");
            }.bind(this), request.onerror = function(event) {
                this.logger.error("Database opening failed", event);
            }.bind(this), request.onblocked = function(event) {
                this.logger.error("Database opening failed! (blocked by browser setting)", event);
            }.bind(this), this;
        }
    },
    upgradeDatabase: {
        value: function(event) {
            this.logger.info("Upgrading database..."), this.storage = event.target.result;
            for (var store in this.stores) if (this.stores.hasOwnProperty(store)) {
                var objectStore;
                store = this.stores[store], this.storage.objectStoreNames.contains(store.path) || this.storage.createObjectStore(store.path, {
                    keyPath: store.key,
                    autoincrement: !1
                }), objectStore = event.target.transaction.objectStore(store.path);
                for (var i = 0, l = objectStore.indexNames.length; l > i; i++) -1 === store.indexes.indexOf(objectStore.indexNames[i]) && objectStore.deleteIndex(objectStore.indexNames[i]);
                for (var j = 0, jl = store.indexes.length; jl > j; j++) objectStore.indexNames.contains(store.indexes[j]) || objectStore.createIndex(store.indexes[j], store.indexes[j], {
                    unique: !1
                });
            }
        }
    },
    setStore: {
        value: function(alias, name, identifier, indexes) {
            return this.stores[alias] = {
                path: name,
                key: identifier,
                indexes: indexes
            }, this;
        }
    },
    read: {
        value: function(storeName, identifier, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Invalid store");
            var store = this.stores[storeName];
            try {
                var transaction = this.storage.transaction([ store.path ], this.transactionModes.READ_ONLY), objectStore = transaction.objectStore(store.path), request = objectStore.get(identifier);
                request.addEventListener("success", function(event) {
                    callback(event.target.result);
                }), request.addEventListener("error", function(event) {
                    this.logger.error("Read operation failed!", event);
                }.bind(this));
            } catch (e) {
                this.logger.error("Read operation failed!", e);
            }
            return this;
        }
    },
    create: {
        value: function(storeName, object, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Invalid store");
            var store = this.stores[storeName];
            try {
                this.mediator.publish(this.name + "::on::pre::create", storeName, object);
                var transaction = this.storage.transaction([ store.path ], this.transactionModes.READ_WRITE), objectStore = transaction.objectStore(store.path), request = objectStore.put(object);
                request.addEventListener("success", function(event) {
                    callback(event.target.result), this.mediator.publish(this.name + "::on::post::create", storeName, object);
                }.bind(this)), request.addEventListener("error", function(event) {
                    this.logger.error("Create operation failed!", event);
                }.bind(this));
            } catch (e) {
                this.logger.error("Create operation failed!", e);
            }
            return this;
        }
    },
    update: {
        value: function(storeName, identifier, object, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Invalid store");
            var store = this.stores[storeName];
            try {
                this.mediator.publish(this.name + "::on::pre::update", storeName, identifier, object);
                var transaction = this.storage.transaction([ store.path ], this.transactionModes.READ_WRITE), objectStore = transaction.objectStore(store.path), request = objectStore.put(object);
                request.addEventListener("success", function(event) {
                    callback(event.target.result), this.mediator.publish(this.name + "::on::post::update", storeName, identifier, object);
                }.bind(this)), request.addEventListener("error", function(event) {
                    this.logger.error("Update operation failed!", event);
                }.bind(this));
            } catch (e) {
                this.logger.error("Update operation failed!", e);
            }
            return this;
        }
    },
    remove: {
        value: function(storeName, identifier, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Invalid store");
            var store = this.stores[storeName];
            try {
                this.mediator.publish(this.name + "::on::pre::remove", storeName, identifier);
                var transaction = this.storage.transaction([ store.path ], this.transactionModes.READ_WRITE), objectStore = transaction.objectStore(store.path), request = objectStore.delete(identifier);
                request.addEventListener("success", function(event) {
                    callback(event.target.result), this.mediator.publish(this.name + "::on::post::remove", storeName, identifier);
                }), request.addEventListener("error", function(event) {
                    this.logger.error("Delete operation failed!", event);
                }.bind(this));
            } catch (e) {
                this.logger.error("Delete operation failed!", e);
            }
            return this;
        }
    },
    find: {
        value: function(store, args) {
            if (!this.stores[store]) throw new ReferenceError("Invalid store");
            store = this.stores[store];
            try {
                var keyRange, request, transaction = this.storage.transaction([ store.path ], this.transactionModes.READ_ONLY), objectStore = transaction.objectStore(store.path), index = objectStore.index(args.index), results = [];
                keyRange = args.value instanceof Array && 2 === args.value.length ? void 0 === args.value[0] ? this.keyRange.upperBound(args.value[1]) : void 0 === args.value[1] ? this.keyRange.lowerBound(args.value[0]) : this.keyRange.bound(args.value[0], args.value[1]) : this.keyRange.only(args.value), 
                request = index.openCursor(keyRange), request.addEventListener("success", function(event) {
                    var result = event.target.result;
                    return !!result == !1 ? void args.callback(args.limit ? results.slice(0, args.limit) : results) : (results.push(result.value), 
                    void result.continue());
                }), request.addEventListener("error", function(event) {
                    this.logger.error("Search operation failed!", event);
                }.bind(this));
            } catch (e) {
                this.logger.error("Search operation failed!", e);
            }
            return this;
        }
    }
}), namespace("Sy.Storage.Engine"), Sy.Storage.Engine.Localstorage = function() {
    if (!JSON) throw new Error("JSON object missing! Please load a polyfill in order to use this engine!");
    this.storage = null, this.stores = {}, this.data = null, this.storageKey = "app::storage", 
    this.mediator = null;
}, Sy.Storage.Engine.Localstorage.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {
    setStorageKey: {
        value: function(storageKey) {
            return this.storageKey = storageKey, this;
        }
    },
    setStorage: {
        value: function(storage) {
            return this.storage = storage, this;
        }
    },
    setMediator: {
        value: function(mediator) {
            return this.mediator = mediator, this;
        }
    },
    open: {
        value: function() {
            if (!this.storage) throw new Error("Storage API object missing");
            var data = this.storage.getItem(this.storageKey);
            return data ? this.data = JSON.parse(data) : this.createStorage(), this;
        }
    },
    createStorage: {
        value: function() {
            this.data = {};
            for (var store in this.stores) this.stores.hasOwnProperty(store) && (this.data[this.stores[store].path] = {});
            return this.flush(), this;
        }
    },
    flush: {
        value: function() {
            return this.storage.setItem(this.storageKey, JSON.stringify(this.data)), this;
        }
    },
    setStore: {
        value: function(alias, name, identifier, indexes) {
            return this.stores[alias] = {
                path: name,
                key: identifier,
                indexes: indexes
            }, this;
        }
    },
    read: {
        value: function(storeName, identifier, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var store = this.stores[storeName];
            return this.data[store.path][identifier] && setTimeout(callback, 0, this.data[store.path][identifier]), 
            this;
        }
    },
    create: {
        value: function(storeName, object, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var store = this.stores[storeName], key = store.key;
            return this.mediator.publish(this.storageKey + "::on::pre::create", storeName, object), 
            this.data[store.path][object[key]] = object, this.flush(), this.mediator.publish(this.storageKey + "::on::post::create", storeName, object), 
            setTimeout(callback, 0, object[key]), this;
        }
    },
    update: {
        value: function(storeName, identifier, object, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var store = this.stores[storeName];
            return this.mediator.publish(this.storageKey + "::on::pre::update", storeName, identifier, object), 
            this.data[store.path][identifier] = object, this.flush(), this.mediator.publish(this.storageKey + "::on::post::update", storeName, identifier, object), 
            setTimeout(callback, 0, object), this;
        }
    },
    remove: {
        value: function(storeName, identifier, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            {
                var store = this.stores[storeName];
                store.key;
            }
            return this.mediator.publish(this.storageKey + "::on::pre::remove", storeName, identifier), 
            delete this.data[store.path][identifier], this.flush(), this.mediator.publish(this.storageKey + "::on::post::remove", storeName, identifier), 
            setTimeout(callback, 0, identifier), this;
        }
    },
    find: {
        value: function(store, args) {
            if (!this.stores[store]) throw new ReferenceError("Unknown store");
            store = this.stores[store];
            var data = [];
            for (var key in this.data[store.path]) if (this.data[store.path].hasOwnProperty(key)) {
                var d = this.data[store.path][key];
                args.value instanceof Array ? (void 0 === args.value[0] && d[args.index] <= args.value[1] || void 0 === args.value[1] && d[args.index] >= args.value[0] || d[args.index] >= args.value[0] && d[args.index] <= args.value[1]) && data.push(d) : d[args.index] === args.value && data.push(d);
            }
            return args.limit && (data = data.slice(0, args.limit)), setTimeout(args.callback, 0, data), 
            this;
        }
    }
}), namespace("Sy.Storage.Engine"), Sy.Storage.Engine.Rest = function(version) {
    this.version = version || 1, this.stores = {}, this.manager = null, this.basePath = "", 
    this.mediator = null, this.headers = {};
}, Sy.Storage.Engine.Rest.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {
    setPattern: {
        value: function(pattern) {
            if (-1 === pattern.indexOf("{{path}}") || -1 === pattern.indexOf("{{key}}")) throw new SyntaxError("Invalid pattern");
            return this.basePath = pattern.replace(/{{version}}/, this.version), this;
        }
    },
    setManager: {
        value: function(manager) {
            if (!(manager instanceof Sy.HTTP.REST)) throw new TypeError("Invalid manager");
            return this.manager = manager, this;
        }
    },
    setMediator: {
        value: function(mediator) {
            return this.mediator = mediator, this;
        }
    },
    setHeaders: {
        value: function(headers) {
            return this.headers = headers, this;
        }
    },
    setStore: {
        value: function(alias, name, identifier, indexes) {
            return this.stores[alias] = {
                path: name,
                key: identifier,
                indexes: indexes
            }, this;
        }
    },
    read: {
        value: function(storeName, identifier, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var meta = this.stores[storeName];
            return this.manager.get({
                uri: this.basePath.replace(/{{path}}/, meta.path).replace(/{{key}}/, identifier),
                headers: this.headers,
                listener: function(resp) {
                    callback(resp.getBody());
                }
            }), this;
        }
    },
    create: {
        value: function(storeName, object, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var meta = this.stores[storeName];
            return this.mediator.publish("app::storage::on::pre::create", this.basePath, storeName, object), 
            this.manager.post({
                uri: this.basePath.replace(/{{path}}/, meta.path).replace(/{{key}}/, ""),
                headers: this.headers,
                data: object,
                listener: function(resp) {
                    callback(resp.getBody()), this.mediator.publish("app::storage::on::post::create", this.basePath, storeName, object);
                }.bind(this)
            }), this;
        }
    },
    update: {
        value: function(storeName, identifier, object, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var meta = this.stores[storeName];
            return this.mediator.publish("app::storage::on::pre::update", this.basePath, storeName, identifier, object), 
            this.manager.put({
                uri: this.basePath.replace(/{{path}}/, meta.path).replace(/{{key}}/, identifier),
                headers: this.headers,
                data: object,
                listener: function(resp) {
                    callback(resp.getBody()), this.mediator.publish("app::storage::on::post::update", this.basePath, storeName, identifier, object);
                }.bind(this)
            }), this;
        }
    },
    remove: {
        value: function(storeName, identifier, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var meta = this.stores[storeName];
            return this.mediator.publish("app::storage::on::pre::remove", this.basePath, storeName, identifier), 
            this.manager.remove({
                uri: this.basePath.replace(/{{path}}/, meta.path).replace(/{{key}}/, identifier),
                headers: this.headers,
                listener: function() {
                    callback(identifier), this.mediator.publish("app::storage::on::post::remove", this.basePath, storeName, identifier);
                }.bind(this)
            }), this;
        }
    },
    find: {
        value: function(args) {
            if (!this.stores[store]) throw new ReferenceError("Unknown store");
            var meta = this.stores[store], queries = [];
            return queries.push(args.value instanceof Array ? args.index + "[]=" + args.value[0] + "&" + args.index + "[]=" + args.value[1] : args.index + "=" + args.value), 
            args.limit && queries.push("limit=" + args.limit), this.manager.get({
                uri: this.basePath.replace(/{{path}}/, meta.path).replace(/{{key}}/, "?" + queries.join("&")),
                headers: this.headers,
                listener: function(resp) {
                    callback(resp.getBody());
                }
            }), this;
        }
    }
}), namespace("Sy.Storage.EngineFactory"), Sy.Storage.EngineFactory.AbstractFactory = function() {
    this.logger = null, this.mediator = null;
}, Sy.Storage.EngineFactory.AbstractFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setLogger: {
        value: function(logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) throw new TypeError("Invalid logger");
            return this.logger = logger, this;
        }
    },
    setMediator: {
        value: function(mediator) {
            if (!(mediator instanceof Sy.Lib.Mediator)) throw new TypeError("Invalid mediator");
            return this.mediator = mediator, this;
        }
    }
}), namespace("Sy.Storage.EngineFactory"), Sy.Storage.EngineFactory.Core = function() {
    this.engines = null;
}, Sy.Storage.EngineFactory.Core.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.engines = registry, this;
        }
    },
    setEngineFactory: {
        value: function(name, factory, mapper) {
            if (this.engines.has(name)) throw new ReferenceError('Factory "' + name + '" already defined');
            if (!(factory instanceof Sy.FactoryInterface)) throw new TypeError("Invalid factory");
            if (!(mapper instanceof Sy.Storage.StoreMapperInterface)) throw new TypeError("Invalid mapper");
            return this.engines.set(name, {
                factory: factory,
                mapper: mapper
            }), this;
        }
    },
    make: {
        value: function(managerConf, entitiesMetadata) {
            var name = managerConf.type;
            if (!this.engines.has(name)) throw new ReferenceError('Unknown factory named "' + name + '"');
            for (var engine, factory = this.engines.get(name).factory, mapper = this.engines.get(name).mapper, stores = [], i = 0, l = entitiesMetadata.length; l > i; i++) stores.push(mapper.transform(entitiesMetadata[i]));
            return engine = factory.make(managerConf.storageName, managerConf.version, stores);
        }
    }
}), namespace("Sy.Storage.EngineFactory"), Sy.Storage.EngineFactory.IndexedDBFactory = function() {
    Sy.Storage.EngineFactory.AbstractFactory.call(this);
}, Sy.Storage.EngineFactory.IndexedDBFactory.prototype = Object.create(Sy.Storage.EngineFactory.AbstractFactory.prototype, {
    make: {
        value: function(name, version, stores) {
            name = name || "app::storage", version = version || 1, stores = stores || [];
            for (var engine = new Sy.Storage.Engine.IndexedDB(version), i = 0, l = stores.length; l > i; i++) engine.setStore(stores[i].alias, stores[i].name, stores[i].identifier, stores[i].indexes);
            return this.logger && engine.setLogger(this.logger), this.mediator && engine.setMediator(this.mediator), 
            engine.setConnection(window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB).setTransaction(window.IDBTransaction || window.webkitIDBTransaction).setKeyRange(window.IDBKeyRange || window.webkitIDBKeyRange).open(), 
            engine;
        }
    }
}), namespace("Sy.Storage.EngineFactory"), Sy.Storage.EngineFactory.LocalstorageFactory = function() {
    Sy.Storage.EngineFactory.AbstractFactory.call(this);
}, Sy.Storage.EngineFactory.LocalstorageFactory.prototype = Object.create(Sy.Storage.EngineFactory.AbstractFactory.prototype, {
    make: {
        value: function(name, version, stores) {
            name = name || "app::storage", version = version || 1, stores = stores || [];
            for (var engine = new Sy.Storage.Engine.Localstorage(version), i = 0, l = stores.length; l > i; i++) engine.setStore(stores[i].alias, stores[i].name, stores[i].identifier, stores[i].indexes);
            return this.mediator && engine.setMediator(this.mediator), engine.setStorage(window.localStorage).open(), 
            engine;
        }
    }
}), namespace("Sy.Storage.EngineFactory"), Sy.Storage.EngineFactory.RestFactory = function() {
    Sy.Storage.EngineFactory.AbstractFactory.call(this), this.manager = null, this.pattern = "/api/{{version}}/{{path}}/{{key}}";
}, Sy.Storage.EngineFactory.RestFactory.prototype = Object.create(Sy.Storage.EngineFactory.AbstractFactory.prototype, {
    setManager: {
        value: function(manager) {
            if (!(manager instanceof Sy.HTTP.REST)) throw new TypeError("Invalid rest manager");
            return this.manager = manager, this;
        }
    },
    make: {
        value: function(name, version, stores) {
            version = version || 1, stores = stores || [];
            for (var engine = new Sy.Storage.Engine.Rest(version), i = 0, l = stores.length; l > i; i++) engine.setStore(stores[i].alias, stores[i].name, stores[i].identifier, stores[i].indexes);
            return this.mediator && engine.setMediator(this.mediator), engine.setManager(this.manager).setPattern(this.pattern), 
            engine;
        }
    }
}), namespace("Sy.Storage"), Sy.Storage.Manager = function() {
    this.repositoryFact = null, this.mapping = [], this.engine = null;
}, Sy.Storage.Manager.prototype = Object.create(Object.prototype, {
    setRepositoryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) throw new TypeError("Invalid repository factory type");
            return this.repositoryFact = factory, this;
        }
    },
    setMapping: {
        value: function(list) {
            if (!(list instanceof Array)) throw new TypeError("Invalid argument");
            return this.mapping = list, this;
        }
    },
    setEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.Storage.EngineInterface)) throw new TypeError("Invalid engine");
            return this.engine = engine, this;
        }
    },
    getEngine: {
        value: function() {
            return this.engine;
        }
    },
    getRepository: {
        value: function(alias) {
            if (this.mapping.length > 0 && -1 === this.mapping.indexOf(alias)) throw new ReferenceError('The manager does not handle "' + alias + '"');
            var repo = this.repositoryFact.make(alias);
            return repo.setEngine(this.engine), repo;
        }
    }
}), namespace("Sy.Storage"), Sy.Storage.ManagerFactory = function() {
    this.engineFact = null, this.repositoryFact = null;
}, Sy.Storage.ManagerFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setEngineFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.Storage.EngineFactory.Core)) throw new TypeError("Invalid engine factory");
            return this.engineFact = factory, this;
        }
    },
    setRepositoryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) throw new TypeError("Invalid repository factory");
            return this.repositoryFact = factory, this;
        }
    },
    make: {
        value: function(name, args, entitiesMeta) {
            var engine, manager = new Sy.Storage.Manager(), meta = [];
            args.mapping = args.mapping || [];
            for (var i = 0, l = entitiesMeta.length; l > i; i++) (0 === args.mapping.length || -1 !== args.mapping.indexOf(entitiesMeta[i].name)) && meta.push(entitiesMeta[i]);
            return engine = this.engineFact.make(args, meta), manager.setRepositoryFactory(this.repositoryFact).setMapping(args.mapping).setEngine(engine), 
            manager;
        }
    }
}), namespace("Sy.Storage"), Sy.Storage.Repository = function() {
    this.engine = null, this.entityKey = null, this.entityConstructor = null, this.uow = null, 
    this.name = null, this.cache = null;
}, Sy.Storage.Repository.prototype = Object.create(Sy.Storage.RepositoryInterface.prototype, {
    setUnitOfWork: {
        value: function(uow) {
            if (!(uow instanceof Sy.Storage.UnitOfWork)) throw new TypeError("Invalid unit of work");
            return this.uow = uow, this;
        }
    },
    setCacheRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.cache = registry, this;
        }
    },
    getUnitOfWork: {
        value: function() {
            return this.uow;
        }
    },
    setName: {
        value: function(name) {
            return this.name = name, this;
        }
    },
    setEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.Storage.EngineInterface)) throw new TypeError("Invalid engine");
            return this.engine = engine, this.uow.setEngine(engine), this;
        }
    },
    setEntityKey: {
        value: function(key) {
            return this.entityKey = key, this;
        }
    },
    setEntityConstructor: {
        value: function(constructor) {
            if (!(constructor.prototype instanceof Sy.EntityInterface)) throw new TypeError("Invalid entity constructor");
            return this.entityConstructor = constructor, this;
        }
    },
    setIndexes: {
        value: function(indexes) {
            if (!(indexes instanceof Array)) throw new TypeError("Invalid indexes definition");
            return this.indexes = indexes, this;
        }
    },
    persist: {
        value: function(entity) {
            if (!(entity instanceof this.entityConstructor)) throw new TypeError("Entity not handled by the repository");
            return this.uow.handle(entity), this.cache.set(entity.get(this.entityKey), entity), 
            this;
        }
    },
    remove: {
        value: function(entity) {
            return this.uow.remove(entity), this;
        }
    },
    flush: {
        value: function() {
            return this.uow.flush(), this;
        }
    },
    findOneBy: {
        value: function(args) {
            return args.index === this.entityKey ? this.cache.has(args.value) ? setTimeout(args.callback, 0, this.cache.get(args.value)) : this.engine.read(this.name, args.value, function(object) {
                args.callback(this.buildEntity(object));
            }.bind(this)) : (args.limit = 1, this.findBy(args)), this;
        }
    },
    findBy: {
        value: function(args) {
            return this.engine.find(this.name, {
                index: args.index,
                value: args.value,
                callback: function(results) {
                    this.findListener(args.callback, results);
                }.bind(this),
                limit: args.limit
            }), this;
        }
    },
    findListener: {
        value: function(callback, results) {
            for (var data = [], i = 0, l = results.length; l > i; i++) data.push(this.buildEntity(results[i]));
            callback(data);
        }
    },
    buildEntity: {
        value: function(object) {
            if (this.cache.has(object[this.entityKey])) return this.cache.get(object[this.entityKey]);
            var entity = new this.entityConstructor();
            return entity.set(object), entity;
        }
    }
}), namespace("Sy.Storage"), Sy.Storage.RepositoryFactory = function() {
    this.meta = null, this.loaded = null, this.uowFactory = null, this.registryFactory = null;
}, Sy.Storage.RepositoryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setRegistryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.RegistryFactory)) throw new TypeError("Invalid registry factory");
            return this.meta = factory.make(), this.loaded = factory.make(), this.registryFactory = factory, 
            this;
        }
    },
    setMeta: {
        value: function(list) {
            for (var i = 0, l = list.length; l > i; i++) this.meta.set(list[i].name, {
                repository: list[i].repository,
                entity: list[i].entity,
                indexes: list[i].indexes,
                uuid: list[i].uuid
            });
            return this;
        }
    },
    setUOWFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.Storage.UnitOfWorkFactory)) throw new TypeError("Invalid factory");
            return this.uowFactory = factory, this;
        }
    },
    make: {
        value: function(alias) {
            if (this.loaded.has(alias)) return this.loaded.get(alias);
            if (!this.meta.has(alias)) throw new ReferenceError('Unknown repository "' + alias + '"');
            var meta = this.meta.get(alias), repo = new meta.repository(), uow = this.uowFactory.make(alias, meta.uuid);
            if (!(repo instanceof Sy.Storage.RepositoryInterface)) throw new TypeError('Invalid repository "' + alias + '"');
            return repo.setName(alias).setEntityKey(meta.uuid).setEntityConstructor(meta.entity).setIndexes(meta.indexes).setUnitOfWork(uow).setCacheRegistry(this.registryFactory.make()), 
            this.loaded.set(alias, repo), repo;
        }
    }
}), namespace("Sy.Storage.StoreMapper"), Sy.Storage.StoreMapper.IndexedDBMapper = function() {}, 
Sy.Storage.StoreMapper.IndexedDBMapper.prototype = Object.create(Sy.Storage.StoreMapperInterface.prototype, {
    transform: {
        value: function(meta) {
            var store = {};
            return store.alias = meta.name, store.name = meta.name.toLowerCase(), store.identifier = meta.uuid, 
            store.indexes = meta.indexes, store;
        }
    }
}), namespace("Sy.Storage.StoreMapper"), Sy.Storage.StoreMapper.LocalstorageMapper = function() {}, 
Sy.Storage.StoreMapper.LocalstorageMapper.prototype = Object.create(Sy.Storage.StoreMapperInterface.prototype, {
    transform: {
        value: function(meta) {
            var store = {};
            return store.alias = meta.name, store.name = meta.name.toLowerCase(), store.identifier = meta.uuid, 
            store.indexes = meta.indexes, store;
        }
    }
}), namespace("Sy.Storage.StoreMapper"), Sy.Storage.StoreMapper.RestMapper = function() {}, 
Sy.Storage.StoreMapper.RestMapper.prototype = Object.create(Sy.Storage.StoreMapperInterface.prototype, {
    transform: {
        value: function(meta) {
            var store = {};
            return store.alias = meta.name, store.name = meta.name.toLowerCase().replace("::", "/"), 
            store.identifier = meta.uuid, store.indexes = meta.indexes, store;
        }
    }
}), namespace("Sy.Storage"), Sy.Storage.UnitOfWork = function() {
    this.states = null, this.engine = null, this.generator = null, this.name = null, 
    this.entityKey = null;
}, Sy.Storage.UnitOfWork.prototype = Object.create(Object.prototype, {
    SCHEDULED_FOR_CREATION: {
        value: "create",
        writable: !1
    },
    SCHEDULED_FOR_UPDATE: {
        value: "update",
        writable: !1
    },
    SCHEDULED_FOR_REMOVAL: {
        value: "remove",
        writable: !1
    },
    setStateRegistry: {
        value: function(states) {
            if (!(states instanceof Sy.StateRegistryInterface)) throw new TypeError("Invalid state registry");
            return this.states = states, this;
        }
    },
    setEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.Storage.EngineInterface)) throw new TypeError("Invalid engine");
            return this.engine = engine, this;
        }
    },
    setGenerator: {
        value: function(generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) throw new TypeError("Invalid generator");
            return this.generator = generator, this;
        }
    },
    setName: {
        value: function(name) {
            return this.name = name, this;
        }
    },
    setEntityKey: {
        value: function(key) {
            return this.entityKey = key, this;
        }
    },
    handle: {
        value: function(entity) {
            if (!(entity instanceof Sy.EntityInterface)) throw new TypeError("Invalid entity");
            return entity.get(this.entityKey) ? this.isScheduledForCreation(entity) ? this.states.set(this.SCHEDULED_FOR_CREATION, entity.get(this.entityKey), entity) : this.states.set(this.SCHEDULED_FOR_UPDATE, entity.get(this.entityKey), entity) : (entity.set(this.entityKey, this.generator.generate()), 
            this.states.set(this.SCHEDULED_FOR_CREATION, entity.get(this.entityKey), entity)), 
            this;
        }
    },
    remove: {
        value: function(entity) {
            this.isScheduledForCreation(entity) ? this.states.remove(this.SCHEDULED_FOR_CREATION, entity.get(this.entityKey)) : this.isScheduledForUpdate(entity) ? (this.states.remove(this.SCHEDULED_FOR_UPDATE, entity.get(this.entityKey)), 
            this.states.set(this.SCHEDULED_FOR_REMOVAL, entity.get(this.entityKey), entity)) : this.states.set(this.SCHEDULED_FOR_REMOVAL, entity.get(this.entityKey), entity);
        }
    },
    isScheduledFor: {
        value: function(event, entity) {
            return this.states.has(event, entity.get(this.entityKey));
        }
    },
    isScheduledForCreation: {
        value: function(entity) {
            return this.isScheduledFor(this.SCHEDULED_FOR_CREATION, entity);
        }
    },
    isScheduledForUpdate: {
        value: function(entity) {
            return this.isScheduledFor(this.SCHEDULED_FOR_UPDATE, entity);
        }
    },
    isScheduledForRemoval: {
        value: function(entity) {
            return this.isScheduledFor(this.SCHEDULED_FOR_REMOVAL, entity);
        }
    },
    flush: {
        value: function() {
            for (var toRemove = this.states.has(this.SCHEDULED_FOR_REMOVAL) ? this.states.get(this.SCHEDULED_FOR_REMOVAL) : [], toUpdate = this.states.has(this.SCHEDULED_FOR_UPDATE) ? this.states.get(this.SCHEDULED_FOR_UPDATE) : [], toCreate = this.states.has(this.SCHEDULED_FOR_CREATION) ? this.states.get(this.SCHEDULED_FOR_CREATION) : [], i = 0, l = toRemove.length; l > i; i++) this.engine.remove(this.name, toRemove[i].get(this.entityKey), this.removalListener.bind(this));
            for (i = 0, l = toUpdate.length; l > i; i++) this.engine.update(this.name, toUpdate[i].get(this.entityKey), this.getEntityData(toUpdate[i]), this.updateListener.bind(this));
            for (i = 0, l = toCreate.length; l > i; i++) this.engine.create(this.name, this.getEntityData(toCreate[i]), this.createListener.bind(this));
            return this;
        }
    },
    getEntityData: {
        value: function(entity) {
            for (var getter, raw = {}, keys = Object.keys(entity.attributes), refl = new ReflectionObject(entity), i = 0, l = keys.length; l > i; i++) getter = "get" + keys[i].substr(0, 1).toUpperCase() + keys[i].substr(1), 
            raw[keys[i]] = refl.hasMethod(getter) ? refl.getMethod(getter).call() : entity.get(keys[i]), 
            raw[keys[i]] instanceof Sy.EntityInterface && (raw[keys[i]] = raw[keys[i]].get(raw[keys[i]].UUID));
            return raw;
        }
    },
    removalListener: {
        value: function(identifier) {
            this.states.remove("remove", identifier);
        }
    },
    updateListener: {
        value: function(object) {
            this.states.remove("update", object[this.entityKey]);
        }
    },
    createListener: {
        value: function(identifier) {
            this.states.remove("create", identifier);
        }
    }
}), namespace("Sy.Storage"), Sy.Storage.UnitOfWorkFactory = function() {
    this.generator = null, this.stateRegistryFactory = null;
}, Sy.Storage.UnitOfWorkFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setGenerator: {
        value: function(generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) throw new TypeError("Invalid generator");
            return this.generator = generator, this;
        }
    },
    setStateRegistryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.StateRegistryFactory)) throw new TypeError("Invalid state registry factory");
            return this.stateRegistryFactory = factory, this;
        }
    },
    make: {
        value: function(name, entityKey) {
            var uow = new Sy.Storage.UnitOfWork();
            return uow.setStateRegistry(this.stateRegistryFactory.make()).setGenerator(this.generator).setName(name).setEntityKey(entityKey), 
            uow;
        }
    }
}), namespace("Sy.View"), Sy.View.NodeWrapper = function() {
    this.engine = null, this.node = null;
}, Sy.View.NodeWrapper.prototype = Object.create(Object.prototype, {
    setTemplateEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.View.TemplateEngineInterface)) throw new TypeError("Invalid template engine");
            return this.engine = engine, this;
        }
    },
    setNode: {
        value: function(node) {
            if (!(node instanceof HTMLElement)) throw new TypeError("Invalid dom node");
            return this.node = node, this;
        }
    },
    getNode: {
        value: function() {
            return this.node;
        }
    },
    render: {
        value: function(data) {
            return this.engine.render(this.node, data), this;
        }
    },
    findOne: {
        value: function(selector) {
            return this.node.querySelector(selector);
        }
    },
    find: {
        value: function(selector) {
            return this.node.querySelectorAll(selector);
        }
    }
}), namespace("Sy.View"), Sy.View.Layout = function() {
    Sy.View.NodeWrapper.call(this), this.name = null, this.lists = null, this.parser = null, 
    this.listFactory = null;
}, Sy.View.Layout.prototype = Object.create(Sy.View.NodeWrapper.prototype, {
    setNode: {
        value: function(node) {
            var lists, wrapper;
            Sy.View.NodeWrapper.prototype.setNode.call(this, node), this.name = node.dataset.syLayout, 
            lists = this.parser.getLists(node);
            for (var i = 0, l = lists.length; l > i; i++) wrapper = this.listFactory.make(lists[i]), 
            this.lists.set(wrapper.getName(), wrapper);
            return this;
        }
    },
    getName: {
        value: function() {
            return this.name;
        }
    },
    setParser: {
        value: function(parser) {
            if (!(parser instanceof Sy.View.Parser)) throw new TypeError("Invalid parser");
            return this.parser = parser, this;
        }
    },
    setListsRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.lists = registry, this;
        }
    },
    setListFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.View.ListFactoryInterface)) throw new TypeError("Invalid list factory");
            return this.listFactory = factory, this;
        }
    },
    getLists: {
        value: function() {
            return this.lists.get();
        }
    },
    getList: {
        value: function(name) {
            return this.lists.get(name);
        }
    }
}), namespace("Sy.View"), Sy.View.LayoutFactory = function() {
    this.parser = null, this.engine = null, this.registryFactory = null, this.listFactory = null;
}, Sy.View.LayoutFactory.prototype = Object.create(Sy.View.LayoutFactoryInterface.prototype, {
    setParser: {
        value: function(parser) {
            if (!(parser instanceof Sy.View.Parser)) throw new TypeError("Invalid parser");
            return this.parser = parser, this;
        }
    },
    setTemplateEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.View.TemplateEngineInterface)) throw new TypeError("Invalid template engine");
            return this.engine = engine, this;
        }
    },
    setRegistryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.RegistryFactory)) throw new TypeError("Invalid registry factory");
            return this.registryFactory = factory, this;
        }
    },
    setListFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.View.ListFactoryInterface)) throw new TypeError("Invalid list factory");
            return this.listFactory = factory, this;
        }
    },
    make: {
        value: function(node) {
            var wrapper = new Sy.View.Layout();
            return wrapper.setParser(this.parser).setListFactory(this.listFactory).setListsRegistry(this.registryFactory.make()).setTemplateEngine(this.engine).setNode(node);
        }
    }
}), namespace("Sy.View"), Sy.View.List = function() {
    Sy.View.NodeWrapper.call(this), this.name = null, this.elements = [], this.types = [];
}, Sy.View.List.prototype = Object.create(Sy.View.NodeWrapper.prototype, {
    setNode: {
        value: function(node) {
            var child;
            Sy.View.NodeWrapper.prototype.setNode.call(this, node), this.name = node.dataset.syList;
            for (var i = 0, l = node.childElementCount; l > i; i++) {
                if (child = node.firstElementChild, this.elements.push(child), node.removeChild(child), 
                this.elements.length > 1 && void 0 === child.dataset.type) throw new SyntaxError("Multiple list elements require a type to be set");
                if (void 0 !== child.dataset.type) {
                    if (-1 !== this.types.indexOf(child.dataset.type)) throw new SyntaxError("Multiple list elements defined with the same type");
                    this.types.push(child.dataset.type);
                }
            }
            return this;
        }
    },
    getName: {
        value: function() {
            return this.name;
        }
    },
    renderElement: {
        value: function(data, type) {
            var node, idx = type ? this.types.indexOf(type) : 0;
            if (-1 === idx) throw new ReferenceError('The type "' + type + '" does not exist for the list "' + this.getName() + '"');
            return node = this.elements[idx].cloneNode(!0), this.engine.render(node, data);
        }
    },
    append: {
        value: function(data, type) {
            return this.getNode().appendChild(this.renderElement(data, type)), this;
        }
    },
    prepend: {
        value: function(data, type) {
            return this.getNode().insertBefore(this.renderElement(data, type), this.getNode().firstElementChild), 
            this;
        }
    },
    render: {
        value: function(data) {
            for (var d, type, node = this.getNode(); node.firstElementChild; ) node.removeChild(node.firstElementChild);
            for (var j = 0, jl = data.length; jl > j; j++) d = data[j], type = d._type, this.append(d, type);
            return this;
        }
    }
}), namespace("Sy.View"), Sy.View.ListFactory = function() {
    this.engine = null;
}, Sy.View.ListFactory.prototype = Object.create(Sy.View.ListFactoryInterface.prototype, {
    setTemplateEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.View.TemplateEngineInterface)) throw new TypeError("Invalid template engine");
            return this.engine = engine, this;
        }
    },
    make: {
        value: function(node) {
            var wrapper = new Sy.View.List();
            return wrapper.setTemplateEngine(this.engine).setNode(node);
        }
    }
}), namespace("Sy.View"), Sy.View.Manager = function() {
    this.views = null, this.factory = null;
}, Sy.View.Manager.prototype = Object.create(Object.prototype, {
    setViewsRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.views = registry, this;
        }
    },
    setViewScreenFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.View.ViewScreenFactoryInterface)) throw new TypeError("Invalid factory");
            return this.factory = factory, this;
        }
    },
    setViewScreen: {
        value: function(node) {
            if (!(node instanceof HTMLElement)) throw new TypeError("Html node expected");
            var name = node.dataset.syView;
            if (!name && "" === name.trim()) throw new SyntaxError('Attribute "data-sy-view" is expected');
            if (this.views.has(name.trim())) throw new ReferenceError('A view with the name "' + name.trim() + '"');
            return this.views.set(name.trim(), this.factory.make(node)), this;
        }
    },
    getViewScreen: {
        value: function(name) {
            if (!this.views.has(name)) throw new ReferenceError('The view screen "' + name + '" is not registered');
            return this.views.get(name);
        }
    }
}), namespace("Sy.View"), Sy.View.Parser = function() {}, Sy.View.Parser.prototype = Object.create(Object.prototype, {
    get: {
        value: function(selector, node) {
            return node = node || document.body, node.querySelectorAll(selector);
        }
    },
    getViewScreens: {
        value: function(node) {
            return this.get("[data-sy-view]", node);
        }
    },
    getLayouts: {
        value: function(node) {
            return this.get("[data-sy-layout]", node);
        }
    },
    getLists: {
        value: function(node) {
            return this.get("[data-sy-list]", node);
        }
    }
}), namespace("Sy.View"), Sy.View.TemplateEngine = function() {
    Sy.View.TemplateEngineInterface.call(this), this.registry = null, this.generator = null;
}, Sy.View.TemplateEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype, {
    setRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.registry = registry, this;
        }
    },
    setGenerator: {
        value: function(generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) throw new TypeError("Invalid generator");
            return this.generator = generator, this;
        }
    },
    render: {
        value: function(node, data) {
            if (node.dataset.syUuid || this.register(node), node.dataset.syUuid && this.registry.has(node.dataset.syUuid) && (this.renderAllAttributes(node, data), 
            this.renderContent(node, data)), node.childElementCount > 0) for (var i = 0, l = node.childElementCount; l > i; i++) this.render(node.children[i], data);
            return node;
        }
    },
    register: {
        value: function(node) {
            for (var uuid = this.generator.generate(), content = {
                attributes: {},
                textContent: null,
                uuid: uuid
            }, i = 0, l = node.attributes.length; l > i; i++) content.attributes[node.attributes[i].name] = node.getAttribute(node.attributes[i].name);
            return content.textContent = node.textContent, node.dataset.syUuid = uuid, this.registry.set(uuid, content), 
            this;
        }
    },
    renderAllAttributes: {
        value: function(node, data) {
            for (var i = 0, l = node.attributes.length; l > i; i++) this.renderAttribute(node, node.attributes[i].name, data);
            return node;
        }
    },
    renderAttribute: {
        value: function(node, attribute, data) {
            var text, uuid = node.dataset.syUuid, originalContent = this.registry.get(uuid).attributes[attribute];
            return originalContent ? (text = this.replace(originalContent, data), node.setAttribute(attribute, text), 
            node) : node;
        }
    },
    replace: {
        value: function(source, data) {
            for (;source.match(this.PATTERN); ) {
                var results = this.PATTERN.exec(source);
                null !== results && results.length >= 1 && (source = source.replace(results[0], reflectedObjectGetter.call(data, results[1]) || ""));
            }
            return source;
        }
    },
    renderContent: {
        value: function(node, data) {
            if (node.childElementCount > 0) return node;
            var d, uuid = node.dataset.syUuid, originalContent = this.registry.get(uuid).textContent, results = this.PATTERN.exec(originalContent);
            return results && (d = objectGetter.call(data, results[1])), d instanceof HTMLElement ? (node.removeChild(node.firstElementChild), 
            node.appendChild(d)) : node.textContent = this.replace(originalContent, data), node;
        }
    }
}), namespace("Sy.View"), Sy.View.ViewPort = function() {
    this.node = null, this.manager = null, this.mediator = null;
}, Sy.View.ViewPort.prototype = Object.create(Sy.View.NodeWrapper.prototype, {
    setMediator: {
        value: function(mediator) {
            if (!(mediator instanceof Sy.Lib.Mediator)) throw new TypeError("Invalid mediator");
            return this.mediator = mediator, this;
        }
    },
    setNode: {
        value: function(node) {
            if (!(node instanceof HTMLElement && node.classList.contains("viewport"))) throw new TypeError("Invalid node");
            return this.node = node, this;
        }
    },
    setViewManager: {
        value: function(manager) {
            if (!(manager instanceof Sy.View.Manager)) throw new TypeError("Invalid manager");
            return this.manager = manager, this;
        }
    },
    getViewManager: {
        value: function() {
            return this.manager;
        }
    },
    display: {
        value: function(name) {
            var viewscreen = this.manager.getViewScreen(name), node = viewscreen.getNode();
            switch (this.mediator && this.mediator.publish("view::on::pre::display", viewscreen), 
            this.node.childElementCount) {
              case 0:
                this.node.appendChild(node);
                break;

              case 1:
                this.node.replaceChild(node, this.node.children[0]);
                break;

              default:
                throw new Error("Viewport in weird state (more than 1 child)");
            }
            return this.mediator && this.mediator.publish("view::on::post::display", viewscreen), 
            this;
        }
    }
}), namespace("Sy.View"), Sy.View.ViewScreen = function() {
    Sy.View.NodeWrapper.call(this), this.name = "", this.parser = null, this.layouts = null, 
    this.layoutFactory = null;
}, Sy.View.ViewScreen.prototype = Object.create(Sy.View.NodeWrapper.prototype, {
    setNode: {
        value: function(node) {
            var layouts, wrapper;
            Sy.View.NodeWrapper.prototype.setNode.call(this, node), this.name = node.dataset.syView, 
            layouts = this.parser.getLayouts(node);
            for (var i = 0, l = layouts.length; l > i; i++) wrapper = this.layoutFactory.make(layouts[i]), 
            this.layouts.set(wrapper.getName(), wrapper);
            return this;
        }
    },
    getName: {
        value: function() {
            return this.name;
        }
    },
    setParser: {
        value: function(parser) {
            if (!(parser instanceof Sy.View.Parser)) throw new TypeError("Invalid parser");
            return this.parser = parser, this;
        }
    },
    setLayoutsRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.layouts = registry, this;
        }
    },
    setLayoutFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.View.LayoutFactoryInterface)) throw new TypeError("Invalid layout factory");
            return this.layoutFactory = factory, this;
        }
    },
    getLayouts: {
        value: function() {
            return this.layouts.get();
        }
    },
    getLayout: {
        value: function(name) {
            return this.layouts.get(name);
        }
    }
}), namespace("Sy.View"), Sy.View.ViewScreenFactory = function() {
    this.parser = null, this.engine = null, this.registryFactory = null, this.layoutFactory = null, 
    this.viewscreens = null;
}, Sy.View.ViewScreenFactory.prototype = Object.create(Sy.View.ViewScreenFactoryInterface.prototype, {
    setParser: {
        value: function(parser) {
            if (!(parser instanceof Sy.View.Parser)) throw new TypeError("Invalid parser");
            return this.parser = parser, this;
        }
    },
    setTemplateEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.View.TemplateEngineInterface)) throw new TypeError("Invalid template engine");
            return this.engine = engine, this;
        }
    },
    setRegistryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.RegistryFactory)) throw new TypeError("Invalid registry factory");
            return this.registryFactory = factory, this.viewscreens = factory.make(), this;
        }
    },
    setLayoutFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.View.LayoutFactoryInterface)) throw new TypeError("Invalid layout factory");
            return this.layoutFactory = factory, this;
        }
    },
    setViewScreenWrapper: {
        value: function(name, viewscreenConstructor) {
            if (this.viewscreens.has(name)) throw new ReferenceError('A viewscreen wrapper is already defined with the name "' + name + '"');
            return this.viewscreens.set(name, viewscreenConstructor), this;
        }
    },
    setDefinedWrappers: {
        value: function(wrappers) {
            for (var i = 0, l = wrappers.length; l > i; i++) this.setViewScreenWrapper(wrappers[i].name, wrappers[i].creator);
            return this;
        }
    },
    make: {
        value: function(node) {
            var wrapper, name = node.dataset.syView;
            if (wrapper = this.viewscreens.has(name) ? new (this.viewscreens.get(name))() : new Sy.View.ViewScreen(), 
            !(wrapper instanceof Sy.View.ViewScreen)) throw new TypeError("Invalid viewscreen wrapper");
            return wrapper.setParser(this.parser).setLayoutFactory(this.layoutFactory).setLayoutsRegistry(this.registryFactory.make()).setTemplateEngine(this.engine).setNode(node);
        }
    }
}), namespace("Sy"), Sy.Configurator = function() {
    this.name = "", this.config = {};
}, Sy.Configurator.prototype = Object.create(Sy.ConfiguratorInterface.prototype, {
    set: {
        value: function(key, value) {
            return key instanceof Object && void 0 === value ? this.config = _.extend(this.config, key) : objectSetter.call(this.config, key, value), 
            this;
        }
    },
    get: {
        value: function(key) {
            var value;
            return void 0 === key ? value = this.config : this.has(key) && (value = objectGetter.call(this.config, key)), 
            value;
        }
    },
    has: {
        value: function(key) {
            try {
                return objectGetter.call(this.config, key), !0;
            } catch (error) {
                if (error instanceof ReferenceError) return !1;
            }
        }
    },
    setName: {
        value: function(name) {
            return this.name = name, this;
        }
    },
    getName: {
        value: function() {
            return this.name;
        }
    }
}), namespace("Sy"), Sy.Controller = function() {
    this.container = null, this.mediator = null, this.mediatorListeners = {}, this.bundle = "", 
    this.viewscreen = null;
}, Sy.Controller.prototype = Object.create(Sy.ControllerInterface.prototype, {
    listen: {
        value: function(channel, fn) {
            var uuid = this.mediator.subscribe({
                channel: channel,
                fn: fn,
                context: this
            });
            return this.mediatorListeners[channel] || (this.mediatorListeners[channel] = []), 
            this.mediatorListeners[channel].push(uuid), this;
        }
    },
    broadcast: {
        value: function() {
            return this.mediator.publish.apply(this.mediator, arguments), this;
        }
    },
    "new": {
        value: function(entity, attributes) {
            var regexp = new RegExp(/^((\w+::)|(\w+))+$/gi), path = null, ent = null;
            if (!regexp.test(entity)) throw new SyntaxError("Invalid entity name format");
            if (path = entity.split("::"), ent = 1 === path.length ? new App.Bundle[this.bundle].Entity[path[0]]() : new App.Bundle[path[0]].Entity[path[1]](), 
            !(ent instanceof Sy.EntityInterface)) throw new TypeError('"' + entity + '" does not implement "Sy.EntityInterface"');
            return ent.set(attributes), ent;
        }
    },
    setBundle: {
        value: function(name) {
            if (!App.Bundle[name]) throw new ReferenceError('The bundle "' + name + '" is undefined');
            return this.bundle = name, this;
        }
    },
    setMediator: {
        value: function(mediator) {
            if (!(mediator instanceof Sy.Lib.Mediator)) throw new TypeError("Invalid mediator");
            return this.mediator = mediator, this;
        }
    },
    setServiceContainer: {
        value: function(container) {
            if (!(container instanceof Sy.ServiceContainerInterface)) throw new TypeError("Invalid service container");
            return this.container = container, this;
        }
    },
    sleep: {
        value: function() {
            for (var channel in this.mediatorListeners) if (this.mediatorListeners.hasOwnProperty(channel)) for (var i = 0, l = this.mediatorListeners[channel].length; l > i; i++) this.mediator.pause(channel, this.mediatorListeners[channel][i]);
        }
    },
    wakeup: {
        value: function() {
            for (var channel in this.mediatorListeners) if (this.mediatorListeners.hasOwnProperty(channel)) for (var i = 0, l = this.mediatorListeners[channel].length; l > i; i++) this.mediator.unpause(channel, this.mediatorListeners[channel][i]);
        }
    },
    destroy: {
        value: function() {
            for (var channel in this.mediatorListeners) if (this.mediatorListeners.hasOwnProperty(channel)) for (var i = 0, l = this.mediatorListeners[channel].length; l > i; i++) this.mediator.remove(channel, this.mediatorListeners[channel][i]);
        }
    },
    setViewScreen: {
        value: function(viewscreen) {
            if (!(viewscreen instanceof Sy.View.ViewScreen)) throw new TypeError("Invalid viewscreen");
            return this.viewscreen = viewscreen, this;
        }
    }
}), DOM = function(node) {
    return this === window ? new DOM(node) : void (this.node = node);
}, DOM.prototype = Object.create(Object.prototype, {
    isChildOf: {
        value: function(toMatch, node) {
            return node = node || this.node, toMatch instanceof HTMLElement ? toMatch === node ? !0 : this.isChildOf(toMatch, node.parentNode) : "string" == typeof toMatch ? this.matches(toMatch) ? !0 : this.matches(toMatch, node.parentNode) : !1;
        }
    },
    matches: {
        value: function(selector, node) {
            return node = node || this.node, node.matches && node.matches(selector) ? !0 : node.webkitMatchesSelector && node.webkitMatchesSelector(selector) ? !0 : node.mozMatchesSelector && node.mozMatchesSelector(selector) ? !0 : node.msMatchesSelector && node.msMatchesSelector(selector) ? !0 : !1;
        }
    }
}), namespace("Sy"), Sy.Entity = function() {
    this.attributes = {}, this.register(this.UUID);
}, Sy.Entity.prototype = Object.create(Sy.EntityInterface.prototype, {
    indexes: {
        value: [],
        enumerable: !1
    },
    connections: {
        value: {},
        enumerable: !1
    },
    UUID: {
        value: "uuid"
    },
    set: {
        value: function(attr, value) {
            if (attr instanceof Object) for (var p in attr) attr.hasOwnProperty(p) && this.set(p, attr[p]); else this.attributes[attr] = value;
            return this;
        }
    },
    get: {
        value: function(attr) {
            return void 0 === attr ? this.attributes : this.attributes[attr];
        }
    },
    register: {
        value: function(attr, entity) {
            var regexp = new RegExp(/^\w+::\w+$/gi);
            if (-1 === this.indexes.indexOf(attr) && (this.indexes.push(attr), void 0 !== entity)) {
                if (!regexp.test(entity)) throw new SyntaxError("Invalid entity name format");
                var path = entity.split("::");
                this.connections[attr] = App.Bundle[path[0]].Entity[path[1]];
            }
            return this;
        }
    },
    lock: {
        value: function(attributes) {
            if (!(attributes instanceof Array)) throw new SyntaxError();
            if (!Object.isSealed(this.attributes)) {
                for (var i = 0, l = attributes.length; l > i; i++) this.attributes[attributes[i]] = null;
                return Object.seal(this.attributes), this;
            }
        }
    }
}), namespace("Sy"), Sy.ParamProxy = function() {
    this.parameters = null, this.serviceContainer = null;
}, Sy.ParamProxy.prototype = Object.create(Object.prototype, {
    setParameters: {
        value: function(parameters) {
            return this.parameters = parameters, this;
        }
    },
    setServiceContainer: {
        value: function(serviceContainer) {
            if (!(serviceContainer instanceof Sy.ServiceContainerInterface)) throw new TypeError("Invalid service container");
            return this.serviceContainer = serviceContainer, this;
        }
    },
    isParameter: {
        value: function(value) {
            return "string" == typeof value && new RegExp(/^%.*%$/i).test(value) ? !0 : !1;
        }
    },
    getParameter: {
        value: function(path) {
            return path = path.substring(1, path.length - 1), objectGetter.call(this.parameters, path);
        }
    },
    isService: {
        value: function(value) {
            return "string" == typeof value && "@" === value.substring(0, 1) ? !0 : !1;
        }
    },
    getService: {
        value: function(name) {
            return name = name.substring(1), this.serviceContainer.get(name);
        }
    },
    isDependency: {
        value: function(value) {
            return this.isParameter(value) || this.isService(value) ? !0 : !1;
        }
    },
    getDependency: {
        value: function(name) {
            return this.isParameter(name) ? this.getParameter(name) : this.isService(name) ? this.getService(name) : name;
        }
    }
}), namespace("Sy"), Sy.StateRegistry = function() {
    this.data = null, this.states = [], this.registryFactory = null;
}, Sy.StateRegistry.prototype = Object.create(Sy.StateRegistryInterface.prototype, {
    setRegistryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.RegistryFactory)) throw new TypeError("Invalid factory");
            return this.registryFactory = factory, this.data = factory.make(), this;
        }
    },
    set: {
        value: function(state, key, value) {
            if (!this.has(state)) {
                var r = this.registryFactory.make();
                this.data.set(state, r), this.states.push(state);
            }
            return this.data.get(state).set(key, value), this;
        }
    },
    has: {
        value: function(state, key) {
            return void 0 === key && this.data.has(state) ? !0 : this.data.has(state) && this.data.get(state).has(key) ? !0 : !1;
        }
    },
    get: {
        value: function(state, key) {
            switch (arguments.length) {
              case 2:
                if (this.has(state, key)) return this.data.get(state).get(key);
                break;

              case 1:
                if (this.has(state)) return this.data.get(state).get();
                break;

              case 0:
                var data = {};
                for (var s in this.states) this.states.hasOwnProperty(s) && (data[this.states[s]] = this.data.get(this.states[s]).get());
                return data;
            }
            throw new ReferenceError('"' + key + '" does not exist in "' + state + '" state');
        }
    },
    state: {
        value: function(key) {
            var states = [];
            for (var s in this.states) this.data.get(this.states[s]).has(key) && states.push(this.states[s]);
            switch (states.length) {
              case 0:
                return void 0;

              case 1:
                return states[0];

              default:
                return states;
            }
        }
    },
    remove: {
        value: function(state, key) {
            if (void 0 === state) for (var i = 0, l = this.states.length; l > i; i++) this.remove(this.states[i]); else this.data.get(state).remove(key);
            return this;
        }
    }
}), namespace("Sy"), Sy.StateRegistryFactory = function() {
    this.registryFactory = null;
}, Sy.StateRegistryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setRegistryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.RegistryFactory)) throw new TypeError("Invalid factory");
            return this.registryFactory = factory, this;
        }
    },
    make: {
        value: function() {
            var q = new Sy.StateRegistry();
            return q.setRegistryFactory(this.registryFactory), q;
        }
    }
}), namespace("Sy"), Sy.Registry = function() {
    this.data = {}, this.registryLength = 0;
}, Sy.Registry.prototype = Object.create(Sy.RegistryInterface.prototype, {
    set: {
        value: function(key, value) {
            return "string" == typeof key && (this.data[key] = value, this.registryLength++), 
            this;
        }
    },
    has: {
        value: function(key) {
            return this.data.hasOwnProperty(key) ? !0 : !1;
        }
    },
    get: {
        value: function(key) {
            if (this.has(key)) return this.data[key];
            if (void 0 === key) {
                var data = [];
                for (var k in this.data) this.data.hasOwnProperty(k) && data.push(this.data[k]);
                return data;
            }
            throw new ReferenceError('"' + key + '" is not defined');
        }
    },
    getMapping: {
        value: function() {
            var data = {};
            for (var k in this.data) this.data.hasOwnProperty(k) && (data[k] = this.data[k]);
            return data;
        }
    },
    remove: {
        value: function(keys) {
            if (void 0 === keys) for (var key in this.data) this.data.hasOwnProperty(key) && this.remove(key); else if (keys instanceof Array) for (var i = 0, l = keys.length; l > i; i++) this.remove(keys[i]); else "string" == typeof keys && this.has(keys) && (delete this.data[keys], 
            this.registryLength--);
            return this;
        }
    },
    length: {
        value: function() {
            return this.registryLength;
        }
    }
}), namespace("Sy"), Sy.RegistryFactory = function() {}, Sy.RegistryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    make: {
        value: function() {
            return new Sy.Registry();
        }
    }
}), namespace("Sy"), Sy.ServiceContainer = function(name) {
    this.name = "", this.services = {}, this.definitions = {}, this.proxy = new Sy.ParamProxy(), 
    this.proxy.setServiceContainer(this), this.setName(name);
}, Sy.ServiceContainer.prototype = Object.create(Sy.ServiceContainerInterface.prototype, {
    PATTERN: {
        value: "^([a-z]+::|[a-z]+)+$",
        writable: !1,
        configurable: !1
    },
    setParameters: {
        value: function(params) {
            return this.proxy.setParameters(params), this;
        }
    },
    getParameter: {
        value: function(path) {
            return this.proxy.getParameter("%" + path + "%");
        }
    },
    get: {
        value: function(serviceName) {
            if (void 0 === this.services[serviceName] && this.definitions[serviceName]) {
                var service, opts = this.definitions[serviceName];
                "creator" === opts.type ? service = this.buildServiceByCreator(serviceName) : "prototype" === opts.type && (service = this.buildServiceByDefinition(serviceName)), 
                this.services[serviceName] = service, delete this.definitions[serviceName];
            } else if (void 0 === this.services[serviceName]) throw new ReferenceError("Unknown service");
            return this.services[serviceName];
        }
    },
    buildServiceByCreator: {
        value: function(name) {
            return this.definitions[name].fn.apply(this);
        }
    },
    buildServiceByDefinition: {
        value: function(name) {
            var service, opts = this.definitions[name], constructor = objectGetter(opts.constructor);
            if ("function" != typeof constructor) throw new TypeError("Invalid constructor");
            if (service = opts.arguments ? new constructor(opts.arguments) : new constructor(), 
            opts.calls instanceof Array) for (var i = 0, l = opts.calls.length; l > i; i++) {
                for (var args = opts.calls[i][1], a = 0, al = args.length; al > a; a++) this.proxy.isDependency(args[a]) && (args[a] = this.proxy.getDependency(args[a]));
                service[opts.calls[i][0]].apply(service, args);
            }
            return service;
        }
    },
    set: {
        value: function(serviceName, creator) {
            return serviceName instanceof Object ? this.setPrototypes(serviceName) : this.setCreator(serviceName, creator), 
            this;
        }
    },
    setCreator: {
        value: function(serviceName, creator) {
            var regex = new RegExp(this.PATTERN, "gi");
            if (!regex.test(serviceName)) throw new SyntaxError('Service name "' + serviceName + '" does not follow pattern convention');
            if ("function" != typeof creator) throw new TypeError("Invalid creator type");
            if (this.has(serviceName)) throw new TypeError('Service name "' + serviceName + '" already used');
            this.definitions[serviceName] = {
                fn: creator,
                type: "creator"
            };
        }
    },
    setPrototypes: {
        value: function(definitions) {
            for (var name in definitions) if (definitions.hasOwnProperty(name)) {
                var regex = new RegExp(this.PATTERN, "gi");
                if (!regex.test(name)) throw new SyntaxError('Service name "' + name + '" does not follow pattern convention');
                if (this.has(name)) throw new TypeError('Service name "' + name + '" already used');
                this.definitions[name] = definitions[name], this.definitions[name].type = "prototype";
            }
        }
    },
    has: {
        value: function(name) {
            return this.services[name] || this.definitions[name] ? !0 : !1;
        }
    },
    getName: {
        value: function() {
            return this.name;
        }
    },
    setName: {
        value: function(name) {
            return this.name = name, this;
        }
    }
}), namespace("Sy"), Sy.Translator = function() {
    this.currentLanguage = null, this.languages = null, this.stateRegistryFactory = null;
}, Sy.Translator.prototype = Object.create(Object.prototype, {
    setRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.Registry)) throw new TypeError("Invalid registry");
            return this.languages = registry, this;
        }
    },
    setStateRegistryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.StateRegistryFactory)) throw new TypeError("Invalid state registry factory");
            return this.stateRegistryFactory = factory, this;
        }
    },
    setLanguage: {
        value: function(language) {
            return this.currentLanguage = language, this;
        }
    },
    registerTranslation: {
        value: function(language, domain, key, translation) {
            return this.languages.has(language) || this.languages.set(language, this.stateRegistryFactory.make()), 
            this.languages.get(language).set(domain, key, translation), this;
        }
    },
    registerTranslations: {
        value: function(language, translations) {
            for (var i = 0, l = translations.length; l > i; i++) this.registerTranslation(language, translations[i].domain || "root", translations[i].key, translations[i].translation);
            return this;
        }
    },
    translate: {
        value: function(key, domain, language) {
            var lang = language || this.currentLanguage;
            return domain = domain || "root", this.languages.has(lang) && this.languages.get(lang).has(domain, key) ? this.languages.get(lang).get(domain, key) : key;
        }
    }
}), namespace("Sy"), Sy.kernel = new Sy.Kernel.Core(), Sy.kernel.getConfig().set({
    env: "prod",
    parameters: {
        app: {
            meta: {
                viewscreens: []
            }
        },
        storage: {
            engines: [ {
                name: "indexeddb",
                factory: "sy::core::storage::factory::engine::indexeddb",
                mapper: "sy::core::storage::storemapper::indexeddb"
            }, {
                name: "localstorage",
                factory: "sy::core::storage::factory::engine::localstorage",
                mapper: "sy::core::storage::storemapper::localstorage"
            }, {
                name: "rest",
                factory: "sy::core::storage::factory::engine::rest",
                mapper: "sy::core::storage::storemapper::rest"
            } ]
        }
    },
    controllers: {
        cache: !0
    }
}), Sy.kernel.getServiceContainer().setParameters(Sy.kernel.getConfig().get("parameters")).set({
    "sy::core::generator::uuid": {
        constructor: "Sy.Lib.Generator.UUID"
    },
    "sy::core::mediator": {
        constructor: "Sy.Lib.Mediator",
        calls: [ [ "setGenerator", [ "@sy::core::generator::uuid" ] ], [ "setLogger", [ "@sy::core::logger" ] ] ]
    },
    "sy::core::http::rest": {
        constructor: "Sy.HTTP.REST",
        calls: [ [ "setManager", [ "@sy::core::http" ] ] ]
    },
    "sy::core::registry::factory": {
        constructor: "Sy.RegistryFactory"
    },
    "sy::core::stateregistry::factory": {
        constructor: "Sy.StateRegistryFactory",
        calls: [ [ "setRegistryFactory", [ "@sy::core::registry::factory" ] ] ]
    },
    "sy::core::view::parser": {
        constructor: "Sy.View.Parser"
    },
    "sy::core::view::factory::list": {
        constructor: "Sy.View.ListFactory",
        calls: [ [ "setTemplateEngine", [ "@sy::core::view::template::engine" ] ] ]
    },
    "sy::core::view::factory::layout": {
        constructor: "Sy.View.LayoutFactory",
        calls: [ [ "setParser", [ "@sy::core::view::parser" ] ], [ "setTemplateEngine", [ "@sy::core::view::template::engine" ] ], [ "setRegistryFactory", [ "@sy::core::registry::factory" ] ], [ "setListFactory", [ "@sy::core::view::factory::list" ] ] ]
    },
    "sy::core::view::factory::viewscreen": {
        constructor: "Sy.View.ViewScreenFactory",
        calls: [ [ "setParser", [ "@sy::core::view::parser" ] ], [ "setTemplateEngine", [ "@sy::core::view::template::engine" ] ], [ "setRegistryFactory", [ "@sy::core::registry::factory" ] ], [ "setLayoutFactory", [ "@sy::core::view::factory::layout" ] ], [ "setDefinedWrappers", [ "%app.meta.viewscreens%" ] ] ]
    },
    "sy::core::storage::factory::engine::indexeddb": {
        constructor: "Sy.Storage.EngineFactory.IndexedDBFactory",
        calls: [ [ "setLogger", [ "@sy::core::logger" ] ], [ "setMediator", [ "@sy::core::mediator" ] ] ]
    },
    "sy::core::storage::factory::engine::localstorage": {
        constructor: "Sy.Storage.EngineFactory.LocalstorageFactory",
        calls: [ [ "setLogger", [ "@sy::core::logger" ] ], [ "setMediator", [ "@sy::core::mediator" ] ] ]
    },
    "sy::core::storage::factory::engine::rest": {
        constructor: "Sy.Storage.EngineFactory.RestFactory",
        calls: [ [ "setLogger", [ "@sy::core::logger" ] ], [ "setMediator", [ "@sy::core::mediator" ] ], [ "setManager", [ "@sy::core::http::rest" ] ] ]
    },
    "sy::core::storage::storemapper::indexeddb": {
        constructor: "Sy.Storage.StoreMapper.IndexedDBMapper"
    },
    "sy::core::storage::storemapper::localstorage": {
        constructor: "Sy.Storage.StoreMapper.LocalstorageMapper"
    },
    "sy::core::storage::storemapper::rest": {
        constructor: "Sy.Storage.StoreMapper.RestMapper"
    },
    "sy::core::storage::unitofwork::factory": {
        constructor: "Sy.Storage.UnitOfWorkFactory",
        calls: [ [ "setGenerator", [ "@sy::core::generator::uuid" ] ], [ "setStateRegistryFactory", [ "@sy::core::stateregistry::factory" ] ] ]
    },
    "sy::core::storage::repository::factory": {
        constructor: "Sy.Storage.RepositoryFactory",
        calls: [ [ "setRegistryFactory", [ "@sy::core::registry::factory" ] ], [ "setUOWFactory", [ "@sy::core::storage::unitofwork::factory" ] ], [ "setMeta", [ "%app.meta.entities%" ] ] ]
    }
}).set("sy::core::logger", function() {
    var logger = new Sy.Lib.Logger.CoreLogger("core"), info = new Sy.Lib.Logger.Handler.Console(logger.INFO), debug = new Sy.Lib.Logger.Handler.Console(logger.DEBUG), error = new Sy.Lib.Logger.Handler.Console(logger.ERROR), log = new Sy.Lib.Logger.Handler.Console(logger.LOG);
    return logger.setHandler(info, logger.INFO), logger.setHandler(debug, logger.DEBUG), 
    logger.setHandler(error, logger.ERROR), logger.setHandler(log, logger.LOG), logger;
}).set("sy::core::http", function() {
    var parser = new Sy.HTTP.HeaderParser(), manager = new Sy.HTTP.Manager();
    return manager.setParser(parser), manager.setGenerator(this.get("sy::core::generator::uuid")), 
    manager.setRegistry(this.get("sy::core::registry::factory").make()), manager;
}).set("sy::core::storage::factory::engine::core", function() {
    var factory = new Sy.Storage.EngineFactory.Core(), factories = this.getParameter("storage.engines");
    factory.setRegistry(this.get("sy::core::registry::factory").make());
    for (var i = 0, l = factories.length; l > i; i++) factory.setEngineFactory(factories[i].name, this.get(factories[i].factory), this.get(factories[i].mapper));
    return factory;
}).set("sy::core::storage", function() {
    var meta = this.getParameter("app.meta.entities"), storage = new Sy.Storage.Core(), managerFact = new Sy.Storage.ManagerFactory(), engineFact = this.get("sy::core::storage::factory::engine::core"), conf = this.getParameter("storage.managers"), registryFact = this.get("sy::core::registry::factory");
    storage.setRegistry(registryFact.make()), managerFact.setEngineFactory(engineFact).setRepositoryFactory(this.get("sy::core::storage::repository::factory"));
    for (var name in conf) if (conf.hasOwnProperty(name)) {
        var manager = managerFact.make(name, conf[name], meta);
        storage.setManager(name, manager);
    }
    return storage;
}).set("sy::core::translator", function() {
    var translator = new Sy.Translator();
    return translator.setRegistry(this.get("sy::core::registry::factory").make()).setStateRegistryFactory(this.get("sy::core::stateregistry::factory")), 
    translator;
}).set("sy::core::view::template::engine", function() {
    var engine = new Sy.View.TemplateEngine();
    return engine.setRegistry(this.get("sy::core::registry::factory").make()).setGenerator(this.get("sy::core::generator::uuid"));
}).set("sy::core::viewport", function() {
    var viewport = new Sy.View.ViewPort();
    return viewport.setNode(document.querySelector(".viewport")).setViewManager(this.get("sy::core::view::manager")).setMediator(this.get("sy::core::mediator"));
}).set("sy::core::view::manager", function() {
    var manager = new Sy.View.Manager(), viewscreens = this.get("sy::core::view::parser").getViewScreens();
    manager.setViewsRegistry(this.get("sy::core::registry::factory").make()).setViewScreenFactory(this.get("sy::core::view::factory::viewscreen"));
    for (var i = 0, l = viewscreens.length; l > i; i++) manager.setViewScreen(viewscreens[i]), 
    DOM(viewscreens[i]).isChildOf(".viewport") || viewscreens[i].parentNode.removeChild(viewscreens[i]);
    return manager;
});