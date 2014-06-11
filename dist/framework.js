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
 * Interface for controllers
 *
 * @package Sy
 * @interface
 */

Sy.ControllerInterface = function () {

    this.container = {};
    this.mediator = {};

};

Sy.ControllerInterface.prototype = Object.create(Object.prototype, {

    /**
     * Shortcut to the mediator subscribe method
     * It automatically register the listener with the controller as context
     *
     * @param {string} channel
     * @param {function} fn
     *
     * @return {Sy.ControllerInterface}
     */

    listen: {
        value: function (channel, fn) {}
    },

    /**
     * Shortcut to the mediator publish method.
     * See the mediator documentation to understand how to pass arguments
     *
     * @return {Sy.ControllerInterface}
     */

    broadcast: {
        value: function () {}
    },

    /**
     * Create a new Entity object
     *
     * @param {string} entity Entity path like "BundleName::EntityName", you can pass only "EntityName" if it's in the current bundle
     * @param {object} attributes Attributes object to create your entity
     *
     * @return {Sy.EntityInterface}
     */

    new: {
        value: function (entity, attributes) {}
    },

    /**
     * Method called when the controller is not used by the framework,
     * like when the controller is not used for the current screen
     *
     * @return {void}
     */

    sleep: {
        value: function () {}
    },

    /**
     * Method called when the controller is reloaded by the framework,
     * happens if a previous viewscreen is displayed back in the viewport
     *
     * @return {void}
     */

    wakeup: {
        value: function () {}
    },

    /**
     * Method called when the controller is destroyed by the framework
     *
     * @return {void}
     */
    destroy: {
        value: function () {}
    },

    /**
     * Set the mediator
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.ControllerInterface}
     */

    setMediator: {
        value: function (mediator) {}
    },

    /**
     * Set the service container
     *
     * @param {Sy.ServiceContainerInterface} container
     *
     * @return {Sy.ControllerInterface}
     */

    setServiceContainer: {
        value: function (container) {}
    },

    /**
     * Set the bundle of the controller
     *
     * @param {String} name
     *
     * @return {Sy.ControllerInterface}
     */

    setBundle: {
        value: function (name) {}
    },

    /**
     * Set the viewscreen it's related to
     *
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.ControllerInterface}
     */

    setViewScreen: {
        value: function (viewscreen) {}
    },

    /**
     * Notify the controller it's fully loaded
     * Can be used to retrieve needed dependencies
     *
     * @return {Sy.ControllerInterface}
     */

    init: {
        value: function () {}
    }

});
namespace('Sy.Kernel');

/**
 * Bind itself to referenced viewscreen actions and
 * re-route handling to the appropriate controller
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.ActionDispatcher = function () {
    this.viewport = null;
    this.controllerManager = null;
    this.mediator = null;
    this.logger = null;
};
Sy.Kernel.ActionDispatcher.prototype = Object.create(Object.prototype, {

    /**
     * Set the viewport wrapper
     *
     * @param {Sy.View.ViewPort} viewport
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    setViewPort: {
        value: function (viewport) {

            if (!(viewport instanceof Sy.View.ViewPort)) {
                throw new TypeError('Invalid viewport');
            }

            this.viewport = viewport;

            return this;

        }
    },

    /**
     * Set the controller manager
     *
     * @param {Sy.Kernel.ControllerManager} manager
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    setControllerManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.Kernel.ControllerManager)) {
                throw new TypeError('Invalid controller manager');
            }

            this.controllerManager = manager;

            return this;

        }
    },

    /**
     * Set the mediator
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    setMediator: {
        value: function (mediator) {

            if (!(mediator instanceof Sy.Lib.Mediator)) {
                throw new TypeError('Invalid mediator');
            }

            this.mediator = mediator;

            return this;

        }
    },

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    setLogger: {
        value: function (logger) {

            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;

        }
    },

    /**
     * Bind viewscreens actions to the dispatcher
     *
     * @param {Array} viewscreens Array of all viewscreens
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    bindViewScreens: {
        value: function (viewscreens) {

            for (var i = 0, l = viewscreens.length; i < l; i++) {
                this.bindViewScreen(viewscreens[i]);
            }

            return this;

        }
    },

    /**
     * Bind registered actions of a viewscreen to this dispatcher
     *
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    bindViewScreen: {
        value: function (viewscreen) {

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen');
            }

            var node = viewscreen.getNode(),
                actions = node.querySelectorAll('[data-sy-action]'),
                actionNode,
                events;

            if (this.logger) {
                this.logger.info('Binding the viewscreen "' + node.dataset.syView + '" actions to the dispatcher...', viewscreen);
            }

            for (var i = 0, l = actions.length; i < l; i++) {
                actionNode = actions[i];

                events = actionNode.dataset.syAction.split('|');
                events.splice(0, 1);

                for (var j = 0, jl = events.length; j < jl; j++) {
                    actionNode.addEventListener(events[j], this.eventCallback.bind(this), false);
                }
            }

        }
    },

    /**
     * Event callback used to re-route action to the wished controller
     *
     * @param {Event} event
     */

    eventCallback: {
        value: function (event) {

            var target = event.currentTarget,
                alias = this.viewport
                    .getCurrentViewScreen()
                    .getNode()
                    .dataset
                    .syController,
                action = target.dataset.syAction.split('|')[0] + 'Action',
                controller,
                evt;

            if (!this.controllerManager.isControllerBuilt(alias)) {
                this.controllerManager.buildController(
                    this.viewport.getCurrentViewScreen()
                );
            }

            controller = this.controllerManager.getController(alias);
            evt = new Sy.Event.ControllerEvent(controller, action, event);

            if (this.logger) {
                this.logger.info('Firing a controller\'s method...', [controller, action]);
            }

            this.mediator.publish(evt.PRE_ACTION, evt);

            controller[action].call(controller, event);

            this.mediator.publish(evt.POST_ACTION, evt);

        }
    }

});

namespace('Sy.Kernel');

/**
 * Class used to inspect app object tree and extract meta informations
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.AppParser = function () {
    this.bundles = [];
    this.controllers = [];
    this.entities = [];
    this.viewscreens = [];
    this.logger = null;
};
Sy.Kernel.AppParser.prototype = Object.create(Object.prototype, {

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Kernle.AppParser}
     */

    setLogger: {
        value: function (logger) {
            this.logger = logger;

            return this;
        }
    },

    /**
     * Return the list of defined bundles
     *
     * @return {Array}
     */

    getBundles: {
        value: function () {

            if (this.bundles.length > 0 || !objectGetter('App.Bundle')) {
                return this.bundles;
            }

            for (var bundle in App.Bundle) {
                if (App.Bundle.hasOwnProperty(bundle)) {
                    this.bundles.push(bundle);
                    this.logger && this.logger.debug('Bundle found', bundle);
                }
            }

            return this.bundles;

        }
    },

    /**
     * Return an object with a correspondance controller alias => controller constructor
     *
     * @return {Object}
     */

    getControllers: {
        value: function () {

            if (this.controllers.length > 0) {
                return this.controllers;
            }

            var bundleCtrl;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleCtrl = App.Bundle[this.bundles[i]].Controller;

                if (!bundleCtrl) {
                    this.logger && this.logger.debug('No controller found in', this.bundles[i]);
                    continue;
                }

                for (var ctrl in bundleCtrl) {
                    if (bundleCtrl.hasOwnProperty(ctrl)) {
                        this.controllers.push({
                            name: this.bundles[i] + '::' + ctrl,
                            creator: bundleCtrl[ctrl]
                        });
                        this.logger && this.logger.debug('Controller found', this.bundles[i] + '::' + ctrl);
                    }
                }
            }

            return this.controllers;

        }
    },

    /**
     * Return the array of all defined entities
     *
     * @return {Array}
     */

    getEntities: {
        value: function () {

            if (this.entities.length > 0) {
                return this.entities;
            }

            var bundleEntities,
                bundleRepositories,
                alias,
                entity;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleEntities = App.Bundle[this.bundles[i]].Entity;
                bundleRepositories = App.Bundle[this.bundles[i]].Repository || {};

                if (!bundleEntities) {
                    this.logger && this.logger.debug('No entity found in', this.bundles[i]);
                    continue;
                }

                for (var name in bundleEntities) {
                    if (bundleEntities.hasOwnProperty(name)) {
                        alias = this.bundles[i] + '::' + name;
                        entity = bundleEntities[name];

                        this.entities.push({
                            name: alias,
                            repository: bundleRepositories[name] || Sy.Storage.Repository,
                            entity: entity,
                            indexes: (new entity()).indexes,
                            uuid: entity.prototype.UUID
                        });

                        this.logger && this.logger.debug('Entity found ' + alias + (
                            bundleRepositories[name] ?
                                ' with custom repository' :
                                ''
                        ));
                    }
                }
            }

            return this.entities;

        }
    },

    /**
     * Return the list of viewscreens wrappers
     *
     * @return {Array}
     */

    getViewScreens: {
        value: function () {

            if (this.viewscreens.length > 0) {
                return this.viewscreens;
            }

            var bundleViewScreens;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleViewScreens = App.Bundle[this.bundles[i]].ViewScreen;

                if (!bundleViewScreens) {
                    this.logger && this.logger.debug('No viewscreen wrapper found in', this.bundles[i]);
                    continue;
                }

                for (var name in bundleViewScreens) {
                    if (bundleViewScreens.hasOwnProperty(name)) {
                        this.viewscreens.push({
                            name: this.bundles[i] + '::' + name,
                            creator: bundleViewScreens[name]
                        });
                        this.logger && this.logger.debug('ViewScreen wrapper found', this.bundles[i] + '::' + name);
                    }
                }
            }

            return this.viewscreens;

        }
    },

    /**
     * Walk through the app services definitions object
     * and call them to register them
     *
     * @param {Sy.ServiceContainerInterface} $container
     *
     * @return {Sy.Kernel.AppParser}
     */

    buildServices: {
        value: function (container) {

            if (!(container instanceof Sy.ServiceContainerInterface)) {
                throw new TypeError('Invalid service container');
            }

            var bundleConfig;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleConfig = App.Bundle[this.bundles[i]].Config;

                if (!bundleConfig || !bundleConfig.Service) {
                    continue;
                }

                bundleConfig = new bundleConfig.Service();
                bundleConfig.define(container);

                this.logger && this.logger.debug('Services loaded from ' + this.bundles[i] + ' bundle');
            }

            return this;

        }
    },

    /**
     * Walk through the app config definitions object
     * and call them to register them
     *
     * @param {Sy.ConfiguratorInterface} $config
     *
     * @return {Sy.Kernel.AppParser}
     */

    buildConfig: {
        value: function (config) {

            if (!(config instanceof Sy.ConfiguratorInterface)) {
                throw new TypeError('Invalid configurator');
            }

            var bundleConfig;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleConfig = App.Bundle[this.bundles[i]].Config;

                if (!bundleConfig || !bundleConfig.Configuration) {
                    continue;
                }

                bundleConfig = new bundleConfig.Configuration();
                bundleConfig.define(config);

                this.logger && this.logger.debug('Configuration loaded from ' + this.bundles[i] + ' bundle');
            }

            return this;

        }
    },

    /**
     * Walk through the app validation rules definitions object
     * and call them to register them in the validator
     *
     * @param {Sy.ServiceContainerInterface} container
     *
     * @return {Sy.Kernel.AppParser}
     */

    registerValidationRules: {
        value: function (container) {
            if (!(container instanceof Sy.ServiceContainerInterface)) {
                throw new TypeError('Invalid service container');
            }

            var validator = container.get('sy::core::validator'),
                bundleConfig;

            if (!(validator instanceof Sy.Validator.Core)) {
                throw new TypeError('Invalid validator');
            }

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleConfig = App.Bundle[this.bundles[i]].Config;

                if (!bundleConfig || !bundleConfig.Validation) {
                    continue;
                }

                bundleConfig = new bundleConfig.Validation();
                bundleConfig.define(validator);

                this.logger && this.logger.debug('Validation rules loaded from ' + this.bundles[i] + ' bundle');
            }

            return this;
        }
    }

});

namespace('Sy.Kernel');

/**
 * Handles controller creation when viewscreen loaded and putting them to sleep when not used
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.ControllerManager = function () {
    this.meta = null;
    this.loaded = null;
    this.mediator = null;
    this.container = null;
    this.current = null;
    this.cache = null;
    this.cacheLength = null;
    this.cacheOrder = [];
};
Sy.Kernel.ControllerManager.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold metadata on app controllers
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setMetaRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.meta = registry;

            return this;

        }
    },

    /**
     * Set a registry to hold loaded controllers
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setLoadedControllersRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.loaded = registry;

            return this;

        }
    },

    /**
     * Register a new controller
     *
     * @param {String} alias
     * @param {Function} constructor
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    registerController: {
        value: function (alias, constructor) {

            if (!(constructor.prototype instanceof Sy.ControllerInterface)) {
                throw new TypeError('Invalid controller constructor');
            }

            this.meta.set(alias, constructor);

            return this;

        }
    },

    /**
     * Sets the mediator to subscribe to viewport events
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setMediator: {
        value: function (mediator) {

            if (!(mediator instanceof Sy.Lib.Mediator)) {
                throw new TypeError('Invalid mediator');
            }

            this.mediator = mediator;

            return this;

        }
    },

    /**
     * Set the service container that will be injected in each controller
     *
     * @param {Sy.ServiceContainerInterface} container
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setServiceContainer: {
        value: function (container) {

            if (!(container instanceof Sy.ServiceContainerInterface)) {
                throw new TypeError('Invalid service container');
            }

            this.container = container;

            return this;

        }
    },

    /**
     * Set if the manager must keep a reference of each instanciated controllers
     * or rebuild them each time a viewscreen referencing it is loaded
     *
     * @param {Boolean} cache
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setCache: {
        value: function (cache) {

            this.cache = !!cache;

            return this;

        }
    },

    /**
     * Set the cache length
     * If null or undefined is passed, no controller will be destroyed
     *
     * @param {mixed} length
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setCacheLength: {
        value: function (length) {

            this.cacheLength = length;

            return this;

        }
    },

    /**
     * Listener to on viewscreen display
     * Used to load appropriate controller
     *
     * @private
     * @param {Sy.View.Event.ViewPortEvent} event
     *
     * @return {void}
     */

    onDisplayListener: {
        value: function (event) {

            var viewscreen = event.getViewScreen(),
                alias = viewscreen.getNode().dataset.syController;

            if (this.loaded.has(alias) && this.current !== alias) {
                this.loaded.get(this.current).sleep();
                this.loaded.get(alias).wakeup();
                this.current = alias;
            } else {
                this.buildController(viewscreen);
            }

        }
    },

    /**
     * Determine how (even if) a controller must be cached
     *
     * @private
     * @param {String} alias
     * @param {Sy.ControllerInterface} instance
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    cacheController: {
        value: function (alias, instance) {

            if (
                this.cache === false ||
                (
                    this.cache === true &&
                    typeof this.cacheLength === 'number' &&
                    this.loaded.length() > this.cacheLength
                )
            ) {
                this.loaded.get(this.cacheOrder[0]).destroy();
                this.loaded.remove(this.cacheOrder[0]);
                this.cacheOrder.splice(0, 1);
            }

            this.loaded.set(alias, instance);
            this.cacheOrder.push(alias);

            return this;

        }
    },

    /**
     * Build a controller instance for the specified viewscreen
     *
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    buildController: {
        value: function (viewscreen) {

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen');
            }

            var alias = viewscreen.getNode().dataset.syController,
                bundleName = alias.split('::')[0],
                instance;

            if (!this.meta.has(alias)) {
                throw new ReferenceError('The controller with the alias "' + alias + '" is undefined');
            }

            instance = new (this.meta.get(alias))();
            instance
                .setBundle(bundleName)
                .setMediator(this.mediator)
                .setServiceContainer(this.container)
                .setViewScreen(viewscreen)
                .init();

            this.cacheController(alias, instance);
            this.current = alias;

            return this;

        }
    },

    /**
     * Check if a controller is built
     *
     * @param {String} alias Controller alias
     *
     * @return {Boolean}
     */

    isControllerBuilt: {
        value: function (alias) {

            return this.loaded.has(alias);

        }
    },

    /**
     * Get the instance of a controller
     *
     * @param {String} alias Controller alias
     *
     * @return {Sy.ControllerInterface}
     */

    getController: {
        value: function (alias) {

            return this.loaded.get(alias);

        }
    },

    /**
     * Bootstrap the manager
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    boot: {
        value: function () {

            this.mediator.subscribe({
                channel: Sy.View.Event.ViewPortEvent.prototype.PRE_DISPLAY,
                fn: this.onDisplayListener,
                context: this
            });

        }
    }

});

namespace('Sy.Kernel');

/**
 * Framework heart
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.Core = function () {
    this.config = new Sy.Configurator();
    this.container = new Sy.ServiceContainer('sy::core');
    this.controllerManager = new Sy.Kernel.ControllerManager();
    this.actionDispatcher = new Sy.Kernel.ActionDispatcher();
};
Sy.Kernel.Core.prototype = Object.create(Object.prototype, {

    /**
     * Return the framework config object
     *
     * @return {Sy.Configurator}
     */

    getConfig: {
        value: function () {
            return this.config;
        }
    },

    /**
     * Return the service container object
     *
     * @return {Sy.ServiceContainer}
     */

    getServiceContainer: {
        value: function () {
            return this.container;
        }
    },

    /**
     * Initiate the kernel that will inspect the app and build necessary data
     *
     * @return {Sy.Kernel.Core}
     */

    boot: {
        value: function () {

            var tester = new Sy.Kernel.FeatureTester(),
                parser = new Sy.Kernel.AppParser();

            tester.testBrowser();

            if (this.config.get('env') !== 'prod') {
                parser.setLogger(this.container.get('sy::core::logger'));
            }

            this.config.set('parameters.app.meta', {
                bundles: parser.getBundles(),
                controllers: parser.getControllers(),
                entities: parser.getEntities(),
                viewscreens: parser.getViewScreens()
            });

            parser
                .buildServices(this.container)
                .buildConfig(this.config)
                .registerValidationRules(this.container);

            this
                .registerControllers(parser.getControllers())
                .configureLogger()
                .registerShutdownListener();

        }
    },

    /**
     * Register all app controllers into the manager
     *
     * @private
     * @param {Array} controllers
     *
     * @return {Sy.Kernel.Core}
     */

    registerControllers: {
        value: function (controllers) {

            var registryFactory = this.container.get('sy::core::registry::factory'),
                mediator = this.container.get('sy::core::mediator'),
                viewport = this.container.get('sy::core::viewport'),
                logger = this.container.get('sy::core::logger'),
                viewscreensManager = this.container.get('sy::core::view::manager');

            this.controllerManager
                .setMetaRegistry(registryFactory.make())
                .setLoadedControllersRegistry(registryFactory.make())
                .setMediator(mediator)
                .setServiceContainer(this.container)
                .setCache(this.config.get('controllers.cache'))
                .setCacheLength(this.config.get('controllers.cacheLength'));

            this.actionDispatcher
                .setViewPort(viewport)
                .setControllerManager(this.controllerManager)
                .setMediator(mediator)
                .setLogger(logger);

            for (var i = 0, l = controllers.length; i < l; i++) {
                this.controllerManager.registerController(
                    controllers[i].name,
                    controllers[i].creator
                );
            }

            this.controllerManager.boot();
            this.actionDispatcher.bindViewScreens(
                viewscreensManager.getViewScreens()
            );

            if (viewport.getCurrentViewScreen()) {
                this.controllerManager.buildController(
                    viewport.getCurrentViewScreen()
                );
            }

            return this;

        }
    },

    /**
     * Adapt the handlers available in the logger depending on the app env
     * If env set to 'prod' remove all of them except for 'error'
     *
     * @return {Sy.Kernel.Core}
     */

    configureLogger: {
        value: function () {

            var env = this.config.get('env'),
                logger = this.container.get('sy::core::logger');

            if (env === 'prod') {
                logger
                    .removeHandler(logger.LOG)
                    .removeHandler(logger.DEBUG)
                    .removeHandler(logger.INFO);
            }

            return this;

        }
    },

    /**
     * Add a `beforeunload` on the window to fire a channel to notify the app
     * it's being closed, so it can be properly shutdown
     *
     * @return {Sy.Kernel.Core}
     */

    registerShutdownListener: {
        value: function () {
            window.addEventListener('beforeunload', function (event) {
                try {
                    var evt = new Sy.Event.AppShutdownEvent(event);

                    this.container.get('sy::core::mediator').publish(
                        evt.KEY,
                        evt
                    );
                } catch (error) {
                    return error.message;
                }
            }.bind(this), false);

            return this;
        }
    }

});

namespace('Sy.Kernel');

/**
 * Helper to ensure the browser is compatible with each
 * of the framework components
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.FeatureTester = function () {};
Sy.Kernel.FeatureTester.prototype = Object.create(Object.prototype, {

    /**
     * Test for XMLHttpRequest and FormData support
     *
     * @private
     * @throws {ReferenceError} If XMLHttpRequest or FormData is not defined
     */

    testXHR: {
        value: function () {

            if (typeof XMLHttpRequest !== 'function') {
                throw new ReferenceError('XMLHttpRequest is not defined');
            }

            if (typeof FormData !== 'function') {
                throw new ReferenceError('FormData is not defined');
            }

        }
    },

    /**
     * Test the support for Function.prototype.bind
     *
     * @private
     * @throws {ReferenceError} If Function.prototype.bind is not defined
     */

    testBind: {
        value: function () {

            if (typeof Function.prototype.bind !== 'function') {
                throw new ReferenceError('The Function.bind method is not defined');
            }

        }
    },

    /**
     * Test for required node attributes (to check support for view engine)
     *
     * @private
     * @throws {ReferenceError} If HTMLElement.dataset is not defined or HTMLElement.attributes is not defined
     */

    testHTMLAttributes: {
        value: function () {

            if (!(document.body.dataset instanceof DOMStringMap)) {
                throw new ReferenceError('Element dataset not supported');
            }

            if (!(document.body.attributes instanceof NamedNodeMap)) {
                throw new ReferenceError('Element.attributes not defined');
            }

        }
    },

    /**
     * Test if the browser support the Element.addEventListener
     *
     * @throws {ReferenceError} If Element.addEventListener is not defined
     */

    testEventListener: {
        value: function () {

            if (typeof document.body.addEventListener !== 'function') {
                throw new ReferenceError('Element.addEventListener is not defined');
            }

        }
    },

    /**
     * Initiate the test suite
     *
     * @return {void}
     */

    testBrowser: {
        value: function () {

            this.testXHR();
            this.testHTMLAttributes();
            this.testBind();
            this.testEventListener();

        }
    }

});

namespace('Sy.Event');

/**
 * Event fired when the window is closed, used to properly shutdown the app
 *
 * @package Sy
 * @subpackage Event
 * @class
 */
Sy.Event.AppShutdownEvent = function (originalEvent) {
    if (!(originalEvent instanceof BeforeUnloadEvent)) {
        throw new TypeError('Invalid unload event');
    }

    this.originalEvent = originalEvent;
};
Sy.Event.AppShutdownEvent.prototype = Object.create(Object.prototype, {

    KEY: {
        value: 'app::shutdown',
        writable: false
    },

    /**
     * Return the original event
     *
     * @return {BeforeUnloadEvent}
     */

    getOriginalEvent: {
        value: function () {
            return this.originalEvent;
        }
    }

});

namespace('Sy.Event');

/**
 * Event fired before and after an action is fired on a controller
 *
 * @package Sy
 * @subpackage Event
 * @class
 */
Sy.Event.ControllerEvent = function (controller, action, event) {
    if (!(controller instanceof Sy.ControllerInterface)) {
        throw new TypeError('Invalid controller');
    }

    if (typeof action !== 'string') {
        throw new TypeError('Invalid action');
    }

    this.controller = controller;
    this.action = action;
    this.event = event;
};
Sy.Event.ControllerEvent.prototype = Object.create(Object.prototype, {

    PRE_ACTION: {
        value: 'controller::on::pre::action',
        writable: false
    },

    POST_ACTION: {
        value: 'controller::on::post::action',
        writable: false
    },

    /**
     * Return the controller instance
     *
     * @return {Sy.ControllerInterface}
     */

    getController: {
        value: function () {
            return this.controller;
        }
    },

    /**
     * Return the action method called on the controller
     *
     * @return {String}
     */

    getAction: {
        value: function () {
            return this.action;
        }
    },

    /**
     * Return original DOM event
     *
     * @return {Event}
     */

    getOriginalEvent: {
        value: function () {
            return this.event;
        }
    }

});

namespace('Sy');

/**
 * Default implementation of a controller
 *
 * @package Sy
 * @class
 * @implements {Sy.ControllerInterface}
 */

Sy.Controller = function () {

    this.container = null;
    this.mediator = null;
    this.mediatorListeners = {};
    this.bundle = '';
    this.viewscreen = null;

};

Sy.Controller.prototype = Object.create(Sy.ControllerInterface.prototype, {

    /**
     * @inheritDoc
     */

    listen: {
        value: function (channel, fn) {

            var uuid = this.mediator.subscribe({
                channel: channel,
                fn: fn,
                context: this
            });

            if (!this.mediatorListeners[channel]) {
                this.mediatorListeners[channel] = [];
            }

            this.mediatorListeners[channel].push(uuid);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    broadcast: {
        value: function () {

            this.mediator.publish.apply(this.mediator, arguments);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    new: {
        value: function (entity, attributes) {

            var regexp = new RegExp(/^((\w+::)|(\w+))+$/gi),
                path = null,
                ent = null;

            if (!regexp.test(entity)) {
                throw new SyntaxError('Invalid entity name format');
            }

            path = entity.split('::');

            if (path.length === 1) {
                ent = new App.Bundle[this.bundle].Entity[path[0]]();
            } else {
                ent = new App.Bundle[path[0]].Entity[path[1]]();
            }

            if (!(ent instanceof Sy.EntityInterface)) {
                throw new TypeError('"' + entity + '" does not implement "Sy.EntityInterface"');
            }

            ent.set(attributes);

            return ent;

        }
    },

    /**
     * @inheritDoc
     */

    setBundle: {
        value: function (name) {

            if (!App.Bundle[name]) {
                throw new ReferenceError('The bundle "' + name + '" is undefined');
            }

            this.bundle = name;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setMediator: {
        value: function (mediator) {

            if (!(mediator instanceof Sy.Lib.Mediator)) {
                throw new TypeError('Invalid mediator');
            }

            this.mediator = mediator;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setServiceContainer: {
        value: function (container) {

            if (!(container instanceof Sy.ServiceContainerInterface)) {
                throw new TypeError('Invalid service container');
            }

            this.container = container;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    sleep: {
        value: function () {

            for (var channel in this.mediatorListeners) {
                if (this.mediatorListeners.hasOwnProperty(channel)) {
                    for (var i = 0, l = this.mediatorListeners[channel].length; i < l; i++) {
                        this.mediator.pause(channel, this.mediatorListeners[channel][i]);
                    }
                }
            }

        }
    },

    /**
     * @inheritDoc
     */

    wakeup: {
        value: function () {

            for (var channel in this.mediatorListeners) {
                if (this.mediatorListeners.hasOwnProperty(channel)) {
                    for (var i = 0, l = this.mediatorListeners[channel].length; i < l; i++) {
                        this.mediator.unpause(channel, this.mediatorListeners[channel][i]);
                    }
                }
            }

        }
    },

    /**
     * @inheritDoc
     */
    destroy: {
        value: function () {

            for (var channel in this.mediatorListeners) {
                if (this.mediatorListeners.hasOwnProperty(channel)) {
                    for (var i = 0, l = this.mediatorListeners[channel].length; i < l; i++) {
                        this.mediator.remove(channel, this.mediatorListeners[channel][i]);
                    }
                }
            }

        }
    },

    /**
     * @inheritDoc
     */

    setViewScreen: {
        value: function (viewscreen) {

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen');
            }

            this.viewscreen = viewscreen;

            return this;

        }
    },

    /**
     * Shortcut to create a form builder
     *
     * @param {Object} object Object that will hold form data
     * @param {Object} options
     *
     * @return {Sy.Form.FormBuilderInterface}
     */

    createFormBuilder: {
        value: function (object, options) {
            return this.container
                .get('sy::core::form')
                .createFormBuilder(object, options);
        }
    },

    /**
     * Shortcut to create a form from a form type
     *
     * @param {Sy.Form.FormTypeInterface|String} formType
     * @param {Object} object Optional
     * @param {Object} options
     *
     * @return {Sy.Form.FormInterface}
     */

    createForm: {
        value: function (formType, object, options) {
            return this.container
                .get('sy::core::form')
                .createForm(formType, object, options);
        }
    }

});
namespace('Sy');

/**
 * Entity interface
 *
 * @package Sy
 * @interface
 */

Sy.EntityInterface = function () {

};

Sy.EntityInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set an attribute value to the entity
     *
     * @param {string} attr
     * @param {mixed} value
     *
     * @return {Sy.EntityInterface}
     */

    set: {
        value: function (attr, value) {

            return this;

        }
    },

    /**
     * Return an attribute value
     *
     * @param {string} attr
     *
     * @return {mixed}
     */

    get: {
        value: function (attr) {}
    },

    /**
     * Register an attribute as index or as a connection to another entity
     *
     * @param {string} attr
     * @param {string} entity If set it will link the attribute to another entity, this param must follow this pattern: \w+::\w+
     *
     * @return {Sy.EntityInterface}
     */

    register: {
        value: function (attr, entity) {}
    },

    /**
     * Block the available attributes for this entity. Once set, the list won't be mutable.
     *
     * @param {Array} attributes
     *
     * @return {Sy.EntityInterface}
     */

    lock: {
        value: function (attributes) {}
    }

});
namespace('Sy');

/**
 * Default implementation of an entity
 *
 * @package Sy
 * @class
 * @implements {Sy.EntityInterface}
 */

Sy.Entity = function () {

    this.attributes = {};

    this.register(this.UUID);

};

Sy.Entity.prototype = Object.create(Sy.EntityInterface.prototype, {

    indexes: {
        value: [],
        enumerable: false
    },

    connections: {
        value: {},
        enumerable: false
    },

    UUID: {
        value: 'uuid'
    },

    /**
     * @inheritDoc
     */

    set: {
        value: function (attr, value) {

            if (attr instanceof Object) {
                for (var p in attr) {
                    if (attr.hasOwnProperty(p)) {
                        this.set(p, attr[p]);
                    }
                }
            } else {
                this.attributes[attr] = value;
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (attr) {

            if (attr === undefined) {
                return this.attributes;
            } else {
                return this.attributes[attr];
            }

        }
    },

    /**
     * @inheritDoc
     */

    register: {
        value: function (attr, entity) {

            var regexp = new RegExp(/^\w+::\w+$/gi);

            if (this.indexes.indexOf(attr) === -1) {
                this.indexes.push(attr);

                if (entity !== undefined) {

                    if (!regexp.test(entity)) {
                        throw new SyntaxError('Invalid entity name format');
                    }

                    var path = entity.split('::');

                    this.connections[attr] = App.Bundle[path[0]].Entity[path[1]];

                }
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    lock: {
        value: function (attributes) {

            if (!(attributes instanceof Array)) {
                throw new SyntaxError();
            }

            if (Object.isSealed(this.attributes)) {
                return;
            }

            for (var i = 0, l = attributes.length; i < l; i++) {
                this.attributes[attributes[i]] = null;
            }

            Object.seal(this.attributes);

            return this;

        }
    }

});
namespace('Sy.Lib.Generator');

/**
 * Interface for all generators
 *
 * @package Sy
 * @subpackage Lib.Generator
 * @interface
 */

Sy.Lib.Generator.Interface = function () {

};

Sy.Lib.Generator.Interface.prototype = Object.create(Object.prototype, {

    generate: {
        value: function () {}
    }

});
namespace('Sy.Lib.Generator');

/**
 * Generates unique identifier following the UUID pattern
 *
 * @package Sy
 * @subpackage Lib.Generator
 * @class
 * @implements {Sy.Lib.Generator.Interface}
 */

Sy.Lib.Generator.UUID = function () {

};

Sy.Lib.Generator.UUID.prototype = Object.create(Sy.Lib.Generator.Interface.prototype, {

    /**
     * Generates a random string of 4 characters long
     *
     * @return {string}
     */

    s4: {
        value: function () {

            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);

        }
    },

    /**
     * Generates a unique identifier of 36 characters long following the pattern [a-Z0-9]{8}-[a-Z0-9]{4}-[a-Z0-9]{4}-[a-Z0-9]{4}-[a-Z0-9]{12}
     *
     * @return {string}
     */

    generate: {
        value: function () {

            return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();

        }
    }

});
namespace('Sy.Lib.Logger');

/**
 * Interface for all loggers
 *
 * @package Sy
 * @subpackage Lib.Logger
 * @interface
 */

Sy.Lib.Logger.Interface = function (name) {

};

Sy.Lib.Logger.Interface.prototype = Object.create(Object.prototype, {

    /**
     * @constant
     */

    LOG: {
        value: 'log',
        writable: false
    },

    /**
     * @constant
     */

    DEBUG: {
        value: 'debug',
        writable: false
    },

    /**
     * @constant
     */

    ERROR: {
        value: 'error',
        writable: false
    },

    /**
     * @constant
     */

    INFO: {
        value: 'info',
        writable: false
    },

    /**
     * Set the name of the logger
     *
     * @param {string} name
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    setName: {
        value: function (name) {

            return this;

        }
    },

    /**
     * Log data without specific level
     *
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    log: {
        value: function (message, data) {

            return this;

        }
    },

    /**
     * Log data for development processes
     *
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    debug: {
        value: function (message, data) {

            return this;

        }
    },

    /**
     * Log level for errors in the app (like catched exceptions)
     *
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    error: {
        value: function (message, data) {

            return this;

        }
    },

    /**
     * Log level to information purpose (like telling the steps happening in the app)
     *
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    info: {
        value: function (message, data) {

            return this;

        }
    },

    /**
     * Set a handler for a specific level
     *
     * @param {Sy.Lib.Logger.Handler.Interface} object
     * @param {string} level
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    setHandler: {
        value: function (object, level) {

            return this;

        }
    },

    /**
     * Check if the logger as a handler for the specific level
     *
     * @param {String} level
     *
     * @return {Boolean}
     */

    isHandlingLevel: {
        value: function (level) {}
    },

    /**
     * Remove a handler for the specified level
     *
     * @param {String} level
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    removeHandler: {
        value: function (level) {}
    },

    /**
     * Prevents adding or removing handlers
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    lock: {
        value: function () {}
    }

});
namespace('Sy.Lib.Logger.Handler');

/**
 * Interfaces for all loggers' handlers
 *
 * @package Sy
 * @subpackage Lib.Logger.Handler
 * @interface
 */

Sy.Lib.Logger.Handler.Interface = function (level) {

};

Sy.Lib.Logger.Handler.Interface.prototype = Object.create(Object.prototype, {

    /**
     * Log the message into the dev tools alongside possible extra data (and the time of the log message).
     * Output the information only if the level is handled by this handler
     *
     * @param {string} name Logger name
     * @param {string} level
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Handler.Interface}
     */

    handle: {
        value: function (name, level, message, data) {}
    },

    /**
     * Check if the wished level is handled by this handler
     *
     * @param {string} level
     *
     * @return {boolean}
     */

    isHandling: {
        value: function (level) {}
    }

});
namespace('Sy.Lib.Logger.Handler');

/**
 * Handles the logging of the app into the browser developer console
 *
 * @package Sy
 * @subpackage Lib.Logger.Handler
 * @class
 * @implements {Sy.Lib.Logger.Handler.Interface}
 */

Sy.Lib.Logger.Handler.Console = function (level) {

    this.level = null;

    this.setLevel(level);

};

Sy.Lib.Logger.Handler.Console.prototype = Object.create(Sy.Lib.Logger.Handler.Interface.prototype, {

    /**
     * Set the logging level for the current handler
     *
     * @param {string} level Must be "log", "debug", "error", "info"
     *
     * @return {Sy.Lib.Logger.Handler.Console}
     */

    setLevel: {
        value: function (level) {

            if (!this.checkLevel(level)) {
                throw new TypeError('Unknown logger level');
            }

            this.level = level;

            return this;

        }
    },

    /**
     * Check that the wished level exists in the logger object,
     * to ensure the user is not trying to set an unknown level
     *
     * @param {string} level
     *
     * @return {boolean}
     */

    checkLevel: {
        value: function (level) {

            if (level.toUpperCase() in Sy.Lib.Logger.Interface.prototype) {
                return true;
            }

            return false;

        }
    },

    /**
     * @inheritDoc
     */

    isHandling: {
        value: function (level) {

            if (level === this.level) {
                return true;
            }

            return false;

        }
    },

    /**
     * @inheritDoc
     */

    handle: {
        value: function (name, level, message, data) {

            if (this.isHandling(level) && 'console' in window) {

                var output = '[' + moment().format('YYYY-M-D hh:mm:ss') + ']',
                    extra = data || [];

                message = message || '';

                output += ' ' + name + '.' + level.toUpperCase();
                output += ' ' + message.toString();

                console[level](output, extra);

            }

            return this;

        }
    }

});
namespace('Sy.Lib.Logger');

/**
 * Default logger of the framework
 *
 * @package Sy
 * @subpackage Lib.Logger
 * @class
 * @implements {Sy.Lib.Logger.Interface}
 *
 * @param {string} name
 */

Sy.Lib.Logger.CoreLogger = function (name) {

    this.name = '';
    this.handlers = {};

    this.setName(name);

};

Sy.Lib.Logger.CoreLogger.prototype = Object.create(Sy.Lib.Logger.Interface.prototype, {

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {

            this.name = name || 'null';

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setHandler: {
        value: function (handler, level) {

            if (handler instanceof Sy.Lib.Logger.Handler.Interface && level.toUpperCase() in this) {

                this.handlers[level] = handler;

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    isHandlingLevel: {
        value: function (level) {

            return !!this.handlers[level];

        }
    },

    /**
     * @inheritDoc
     */

    removeHandler: {
        value: function (level) {

            if (this.isHandlingLevel(level)) {
                delete this.handlers[level];
            }

            return this;

        }
    },

    /**
     * Transfer the log information to the appropriate handler depending on the level wished
     *
     * @param {string} level
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.CoreLogger}
     */

    handle: {
        value: function (level, message, data) {

            if (this.handlers[level]) {

                this.handlers[level].handle(this.name, level, message, data);

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    log: {
        value: function (message, data) {

            this.handle(this.LOG, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    debug: {
        value: function (message, data) {

            this.handle(this.DEBUG, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    error: {
        value: function (message, data) {

            this.handle(this.ERROR, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    info: {
        value: function (message, data) {

            this.handle(this.INFO, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    lock: {
        value: function () {

            Object.seal(this.handlers);

            return this;

        }
    }

});
namespace('Sy');

/**
 * Interface to standardize the factories of the framework
 *
 * @package Sy
 * @interface
 */
Sy.FactoryInterface = function () {};

Sy.FactoryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Method to generate a new instance of the object handle by the factory
     *
     * @return {mixed}
     */
    make: {
        value: function () {}
    }

});
namespace('Sy.Lib');

/**
 * Allow to set a series of function that will be called when a channel is "published" via this object
 *
 * @package Sy
 * @subpackage Lib
 * @class
 */

Sy.Lib.Mediator = function () {

    this.channels = {};
    this.generator = null;
    this.logger = null;

};

Sy.Lib.Mediator.prototype = Object.create(Object.prototype, {

    /**
     * Add a subscriber to a channel
     *
     * @param {object} options Available properties: {channel: string, fn: function, context: object, priority: integer, async: boolean}
     *
     * @return {string} A unique identifier for this subscriber
     */

    subscribe: {
        value: function (options) {

            var options = options || {},
                channel = null;

            if (options.priority === undefined){
                options.priority = 1;
            }

            if (this.channels[options.channel] === undefined) {

                channel = new Sy.Lib.MediatorChannel(options.channel);
                channel.setGenerator(this.generator);

                if (this.logger) {
                    channel.setLogger(this.logger);
                }

                this.channels[options.channel] = channel;

            }

            return this.channels[options.channel].add(
                options.fn,
                options.context,
                options.priority,
                options.async,
                options.bubbles
            );

        }

    },

    /**
     * Remove an element of a channel subscribers list
     *
     * @param {string} channel
     * @param {string} id Identifier returned by the method subscribe
     *
     * @return {Sy.Lib.Mediator}
     */

    remove: {
        value: function (channel, id) {

            if (this.channels[channel] !== undefined) {

                this.channels[channel].remove(id);

            }

            return this;

        }

    },

    /**
     * Publish a channel, all arguments after the channel name will
     * be passed to the subscribers as arguments
     *
     * @param {string} channel Channel name
     *
     * @return {Sy.Lib.Mediator}
     */

    publish: {
        value: function () {

            if (arguments.length === 0) {
                return this;
            }

            var channel = Array.prototype.slice.call(arguments, 0, 1)[0],
                args = Array.prototype.slice.call(arguments, 1);

            if (this.channels[channel] !== undefined) {

                this.channels[channel].publish(args);

            }

            return this;

        }

    },

    /**
     * Pause a channel from being fired
     *
     * @param {string} channel
     * @param {string} subscriber Subscriber id, if you want to pause only one subscriber (optional)
     *
     * @return {Sy.Lib.Mediator}
     */

    pause: {
        value: function (channel, subscriber) {

            if (this.channels[channel] !== undefined) {

                this.channels[channel].stopped = true;

                if (subscriber) {
                    this.channels[channel].pause(subscriber);
                }

            }

            return this;

        }

    },

    /**
     * Unpause a channel from being fired
     *
     * @param {string} channel
     * @param {string} subscriber Subscriber id, if you want to unpause only one subscriber (optional)
     *
     * @return {Sy.Lib.Mediator}
     */

    unpause: {
        value: function (channel, subscriber) {

            if (this.channels[channel] !== undefined) {

                this.channels[channel].stopped = false;

                if (subscriber) {
                    this.channels[channel].unpause(subscriber);
                }

            }

            return this;

        }

    },

    /**
     * Say if a channel is paused or not
     *
     * @param {string} channel
     *
     * @return {boolean}
     */

    paused: {
        value: function (channel) {

            if (this.channels[channel] === undefined) {

                return;

            }

            return this.channels[channel].stopped;

        }

    },

    /**
     * Generator dependency setter
     *
     * @param {Sy.Lib.Generator.Interface} object
     *
     * @return {Sy.Lib.Mediator}
     */

    setGenerator: {
        value: function (object) {

            if (!(object instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = object;

            return this;

        }
    },

    /**
     * Logger dependency setter
     *
     * @param {Sy.Lib.Logger.Interface} object
     *
     * @return {Sy.Lib.Mediator}
     */

    setLogger: {
        value: function (object) {

            if (!(object instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = object;

            return this;

        }
    }

});

/**
 * Channel object to be instanciated every time a new channel is created
 *
 * @package Sy
 * @subpackage Lib
 * @class
 *
 * @param {string} name
 */

Sy.Lib.MediatorChannel = function (name) {

    this.name = name || '';
    this.stopped = false;
    this.subscribers = {};
    this.generator = null;
    this.logger = null;

};

Sy.Lib.MediatorChannel.prototype = Object.create(Object.prototype, {

    /**
     * Add a subscriber to the channel
     *
     * @param {function} fn
     * @param {object} context Callback context
     * @param {integer} priority
     * @param {boolean} async
     * @param {boolean} bubbles Set to true if you want errors to bubbles up (otherwise it's catched by the library)
     */

    add: {
        value: function (fn, context, priority, async, bubbles) {

            var guid = this.generator.generate();

            this.subscribers[guid] = {
                fn: fn,
                context: context || window,
                priority: priority || 1,
                async: !!async,
                bubbles: !!bubbles,
                stopped: false
            };

            return guid;

        }

    },

    /**
     * Remove an element of the subscribers list
     *
     * @param {string} id
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    remove: {
        value: function (id) {

            delete this.subscribers[id];

            return this;

        }

    },

    /**
     * Call every subscribers function when a channel is published
     *
     * @param {Array} args Arguments to be passed to the subscribers
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    publish: {
        value: function (args) {

            var args = args || [];

            if (this.stopped === false) {

                var fns = [];

                for (var s in this.subscribers) {

                    if (this.subscribers.hasOwnProperty(s) && this.subscribers[s].stopped === false) {

                        fns.push(this.subscribers[s]);

                    }

                }

                fns.sort(function (a, b) {
                    return a.priority - b.priority;
                });

                for (var i = 0, l = fns.length; i < l; i++) {

                    try {

                        var subscriber = fns[i];

                        if (subscriber.async === true) {
                            setTimeout(
                                this.subscriberCall,
                                0,
                                this,
                                subscriber.fn,
                                subscriber.context,
                                args
                            );
                        } else {
                            this.subscriberCall(
                                this,
                                subscriber.fn,
                                subscriber.context,
                                args
                            );
                        }

                    } catch (error) {

                        if (this.logger) {
                            this.logger.error(error.message, error);
                        }

                        if (subscriber.bubbles === true) {
                            throw error;
                        }

                    }

                }

            }

            return this;

        }

    },

    /**
     * Generator dependency setter
     *
     * @param {Sy.Lib.Generator.interface} object
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    setGenerator: {
        value: function (object) {

            if (!(object instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = object;

            return this;

        }
    },

    /**
     * Logger dependency setter
     *
     * @param {Sy.Lib.Logger.Interface} object
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    setLogger: {
        value: function (object) {

            if (!(object instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = object;

            return this;

        }
    },

    /**
     * Handle calling subscribers and catching exceptions it may throw
     *
     * @param {Sy.Lib.MediatorChannel} self Channel instance
     * @param {function} fn
     * @param {object} context Subscriber context
     * @param {Array} args Subscriber arguments
     *
     * @return {void}
     */

    subscriberCall: {
        value: function (self, fn, context, args) {

            fn.apply(context, args);

        }
    },

    /**
     * Prevent a subscriber from being fired when the channel is published
     *
     * @param {string} id Subscriber id
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    pause: {
        value: function (id) {

            if (this.subscribers[id]) {
                this.subscribers[id].stopped = true;
            }

            return this;

        }
    },

    /**
     * Re-enable a subscriber from being fired if it has been paused before
     *
     * @param {string} id
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    unpause: {
        value: function (id) {

            if (this.subscribers[id]) {
                this.subscribers[id].stopped = false;
            }

            return this;

        }
    }

});
namespace('Sy.HTTP');

/**
 * Interface for building HTTP requests
 *
 * @package Sy
 * @subpackage HTTP
 * @interface
 */

Sy.HTTP.RequestInterface = function () {};

Sy.HTTP.RequestInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set the uri of the request
     *
     * @param {string} uri
     *
     * @return {Sy.HTTP.RequestInterface}
     */

    setURI: {
        value: function (uri) {}
    },

    /**
     * Get the uri
     *
     * @return {string}
     */

    getURI: {
        value: function () {}
    },

    /**
     * Set the method for the request (GET, POST, ...)
     *
     * @param {string} method
     *
     * @return {Sy.HTTP.RequestInterface}
     */

    setMethod: {
        value: function (method) {}
    },

    /**
     * Get the method of the request
     *
     * @return {string}
     */

    getMethod: {
        value: function () {}
    },

    /**
     * Set the data to send in the request
     *
     * @param {object} data
     *
     * @return {Sy.HTTP.RequestInterface}
     */

    setData: {
        value: function (data) {}
    },

    /**
     * Get the request data
     *
     * @return {object}
     */

    getData: {
        value: function () {}
    },

    /**
     * Set a header value
     *
     * Multiple can be set at a time by passing an object like {headerName: value, ...}
     *
     * @param {string|object} header
     * @param {string} value
     *
     * @return {Sy.HTTP.RequestInterface}
     */

    setHeader: {
        value: function (header, value) {}
    },

    /**
     * Get the value of a header field
     *
     * If no header set, it return all of them
     *
     * @param {string} header
     *
     * @return {string|object}
     */

    getHeader: {
        value: function (header) {}
    },

    /**
     * Set a listener to the request to be executed when the response is received
     *
     * @param {function} fn
     * @param {object} context Context object for the listener
     *
     * @return {Sy.HHTP.RequestInterface}
     */

    setListener: {
        value: function (fn, context) {}
    },

    /**
     * Get the listener
     *
     * @return {object}
     */

    getListener: {
        value: function () {}
    },

    /**
     * Set the type of content requested (html/json)
     *
     * @param {string} type
     *
     * @return {Sy.HTTP.RequestInterface}
     */

    setType: {
        value: function (type) {}
    },

    /**
     * Get the request type
     *
     * @return {string}
     */

    getType: {
        value: function () {}
    }

});
namespace('Sy.HTTP');

/**
 * Interface for HTTP response
 *
 * @package Sy
 * @subpackage HTTP
 * @interface
 */

Sy.HTTP.ResponseInterface = function () {};

Sy.HTTP.ResponseInterface.prototype = Object.create(Object.prototype, {

    HTTP_CONTINUE: {
        value: 100,
        writable: false
    },

    HTTP_SWITCHING_PROTOCOLS: {
        value: 101,
        writable: false
    },

    HTTP_PROCESSING: {
        value: 102,
        writable: false
    },

    HTTP_OK: {
        value: 200,
        writable: false
    },

    HTTP_CREATED: {
        value: 201,
        writable: false
    },

    HTTP_ACCEPTED: {
        value: 202,
        writable: false
    },

    HTTP_NON_AUTHORITATIVE_INFORMATION: {
        value: 203,
        writable: false
    },

    HTTP_NO_CONTENT: {
        value: 204,
        writable: false
    },

    HTTP_RESET_CONTENT: {
        value: 205,
        writable: false
    },

    HTTP_PARTIAL_CONTENT: {
        value: 206,
        writable: false
    },

    HTTP_MULTI_STATUS: {
        value: 207,
        writable: false
    },

    HTTP_ALREADY_REPORTED: {
        value: 208,
        writable: false
    },

    HTTP_IM_USED: {
        value: 226,
        writable: false
    },

    HTTP_MULTIPLE_CHOICES: {
        value: 300,
        writable: false
    },

    HTTP_MOVED_PERMANENTLY: {
        value: 301,
        writable: false
    },

    HTTP_FOUND: {
        value: 302,
        writable: false
    },

    HTTP_SEE_OTHER: {
        value: 303,
        writable: false
    },

    HTTP_NOT_MODIFIED: {
        value: 304,
        writable: false
    },

    HTTP_USE_PROXY: {
        value: 305,
        writable: false
    },

    HTTP_RESERVED: {
        value: 306,
        writable: false
    },

    HTTP_TEMPORARY_REDIRECT: {
        value: 307,
        writable: false
    },

    HTTP_PERMANENTLY_REDIRECT: {
        value: 308,
        writable: false
    },

    HTTP_BAD_REQUEST: {
        value: 400,
        writable: false
    },

    HTTP_UNAUTHORIZED: {
        value: 401,
        writable: false
    },

    HTTP_PAYMENT_REQUIRED: {
        value: 402,
        writable: false
    },

    HTTP_FORBIDDEN: {
        value: 403,
        writable: false
    },

    HTTP_NOT_FOUND: {
        value: 404,
        writable: false
    },

    HTTP_METHOD_NOT_ALLOWED: {
        value: 405,
        writable: false
    },

    HTTP_NOT_ACCEPTABLE: {
        value: 406,
        writable: false
    },

    HTTP_PROXY_AUTHENTICATION_REQUIRED: {
        value: 407,
        writable: false
    },

    HTTP_REQUEST_TIMEOUT: {
        value: 408,
        writable: false
    },

    HTTP_CONFLICT: {
        value: 409,
        writable: false
    },

    HTTP_GONE: {
        value: 410,
        writable: false
    },

    HTTP_LENGTH_REQUIRED: {
        value: 411,
        writable: false
    },

    HTTP_PRECONDITION_FAILED: {
        value: 412,
        writable: false
    },

    HTTP_REQUEST_ENTITY_TOO_LARGE: {
        value: 413,
        writable: false
    },

    HTTP_REQUEST_URI_TOO_LONG: {
        value: 414,
        writable: false
    },

    HTTP_UNSUPPORTED_MEDIA_TYPE: {
        value: 415,
        writable: false
    },

    HTTP_REQUESTED_RANGE_NOT_SATISFIABLE: {
        value: 416,
        writable: false
    },

    HTTP_EXPECTATION_FAILED: {
        value: 417,
        writable: false
    },

    HTTP_I_AM_TEAPOT: {
        value: 418,
        writable: false
    },

    HTTP_UNPROCESSABLE_ENTITY: {
        value: 422,
        writable: false
    },

    HTTP_LOCKED: {
        value: 423,
        writable: false
    },

    HTTP_FAILED_DEPENDENCY: {
        value: 424,
        writable: false
    },

    HTTP_RESERVED_FOR_WEBDAV_ADVANCED_COLLECTIONS_EXPIRED_PROPOSAL: {
        value: 425,
        writable: false
    },

    HTTP_UPGRADE_REQUIRED: {
        value: 426,
        writable: false
    },

    HTTP_PRECONDITION_REQURED: {
        value: 428,
        writable: false
    },

    HTTP_TOO_MANY_REQUESTS: {
        value: 429,
        writable: false
    },

    HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE: {
        value: 431,
        writable: false
    },

    HTTP_INTERNAL_SERVOR_ERROR: {
        value: 500,
        writable: false
    },

    HTTP_NOT_IMPLEMENTED: {
        value: 501,
        writable: false
    },

    HTTP_BAD_GATEWAY: {
        value: 502,
        writable: false
    },

    HTTP_SERVICE_UNAVAILABLE: {
        value: 503,
        writable: false
    },

    HTTP_GATEWAY_TIMEOUT: {
        value: 504,
        writable: false
    },

    HTTP_VERSION_NOT_SUPPORTED: {
        value: 505,
        writable: false
    },

    HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL: {
        value: 506,
        writable: false
    },

    HTTP_INSUFFICIENT_STORAGE: {
        value: 507,
        writable: false
    },

    HTTP_LOOP_DETECTED: {
        value: 508,
        writable: false
    },

    HTTP_NOT_EXTENDED: {
        value: 510,
        writable: false
    },

    HTTP_NETWORK_AUTHENTICATION_REQUIRED: {
        value: 511,
        writable: false
    },

    /**
     * Set the status code
     *
     * @param {int} code
     *
     * @return {Sy.HTTP.ResponseInterface}
     */

    setStatusCode: {
        value: function (code) {}
    },

    /**
     * Get the status code
     *
     * @return {int}
     */

    getStatusCode: {
        value: function () {}
    },

    /**
     * Set the status message
     *
     * @param {string} message
     *
     * @return {Sy.HTTP.ResponseInterface}
     */

    setStatusText: {
        value: function (message) {}
    },

    /**
     * Get status message
     *
     * @return {string}
     */

    getStatusText: {
        value: function () {}
    },

    /**
     * Set the list of headers
     *
     * @param {object} headers
     *
     * @return {Sy.HTTP.ResponseInterface}
     */

    setHeaders: {
        value: function (headers) {}
    },

    /**
     * Get the value of a header
     *
     * If no header specified it returns all of them
     *
     * @param {string} header
     *
     * @return {mixed}
     */

    getHeader: {
        value: function (header) {}
    },

    /**
     * Set the body data
     *
     * @param {mixed} body
     *
     * @return {Sy.HTTP.ResponseHeader}
     */

    setBody: {
        value: function (body) {}
    },

    /**
     * Get the body content
     *
     * @return {mixed}
     */

    getBody: {
        value: function () {}
    }

});
namespace('Sy.HTTP');

/**
 * Default implementation of the RequestInterface
 *
 * @package Sy
 * @subpackage HTTP
 * @implements {Sy.HTTP.RequestInterface}
 * @class
 */

Sy.HTTP.Request = function () {

    this.method = 'GET';
    this.data = new Sy.Registry();
    this.headers = new Sy.Registry();
    this.listener = null;
    this.type = '';
    this.uri = '';

};

Sy.HTTP.Request.prototype = Object.create(Sy.HTTP.RequestInterface.prototype, {

    /**
     * @inheritDoc
     */

    setURI: {
        value: function (uri) {

            this.uri = uri;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getURI: {
        value: function () {

            return this.uri;

        }
    },

    /**
     * @inheritDoc
     */

    setMethod: {
        value: function (method) {

            var m = method.toUpperCase();

            if (['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'].indexOf(m) !== -1) {

                this.method = m;

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getMethod: {
        value: function () {

            return this.method;

        }
    },

    /**
     * @inheritDoc
     */

    setData: {
        value: function (data) {

            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    this.data.set(k, data[k]);
                }
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getData: {
        value: function () {

            return this.data.getMapping();

        }
    },

    /**
     * @inheritDoc
     */

    setHeader: {
        value: function (header, value) {

            if (header instanceof Object) {
                for (var k in header) {
                    if (header.hasOwnProperty(k)) {
                        this.setHeader(k, header[k]);
                    }
                }
            } else if (typeof header === 'string' && typeof value === 'string') {

                this.headers.set(header, value);

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getHeader: {
        value: function (header) {

            if (header !== undefined) {
                if (this.headers.has(header)) {
                    return this.headers.get(header);
                }

                return undefined;
            }

            return this.headers.getMapping();

        }
    },

    /**
     * @inheritDoc
     */

    setListener: {
        value: function (fn) {

            this.listener = fn;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getListener: {
        value: function () {

            return this.listener;

        }
    },

    /**
     * @inheritDoc
     */

    setType: {
        value: function (type) {

            if (['html', 'json'].indexOf(type) !== -1) {
                this.type = type;
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getType: {
        value: function () {

            return this.type;

        }
    }

});
namespace('Sy.HTTP');

/**
 * Default implementation of the ResponseInterface
 *
 * @package Sy
 * @subpackage HTTP
 * @implements {Sy.HTTP.ResponseInterface}
 * @class
 */

Sy.HTTP.Response = function () {

    this.statusCode = 0;
    this.statusText = null;
    this.headers = new Sy.Registry();
    this.body = null;

};

Sy.HTTP.Response.prototype = Object.create(Sy.HTTP.ResponseInterface.prototype, {

    /**
     * @inheritDoc
     */

    setStatusCode: {
        value: function (code) {

            this.statusCode = parseInt(code, 10);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getStatusCode: {
        value: function () {

            return this.statusCode;

        }
    },

    /**
     * @inheritDoc
     */

    setStatusText: {
        value: function (message) {

            this.statusText = message;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getStatusText: {
        value: function () {

            return this.statusText;

        }
    },

    /**
     * @inheritDoc
     */

    setHeaders: {
        value: function (headers) {

            for (var h in headers) {
                if (headers.hasOwnProperty(h)) {
                    this.headers.set(h, headers[h]);
                }
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getHeader: {
        value: function (header) {

            if (header === undefined) {

                return this.headers.getMapping();

            } else if (this.headers.has(header)) {

                return this.headers.get(header);

            }

            return undefined;

        }
    },

    /**
     * @inheritDoc
     */

    setBody: {
        value: function (body) {

            this.body = body;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getBody: {
        value: function () {

            return this.body;

        }
    }

});
namespace('Sy.HTTP');

/**
 * Object for requesting JSON documents via ajax
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Request}
 * @class
 */

Sy.HTTP.JSONRequest = function () {

    Sy.HTTP.Request.call(this);

    this.setType('json');
    this.setHeader('Accept', 'application/json');

};

Sy.HTTP.JSONRequest.prototype = Object.create(Sy.HTTP.Request.prototype);
namespace('Sy.HTTP');

/**
 * Response when JSON is returned
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Response}
 * @class
 */

Sy.HTTP.JSONResponse = function () {

    Sy.HTTP.Response.call(this);

};

Sy.HTTP.JSONResponse.prototype = Object.create(Sy.HTTP.Response.prototype);
namespace('Sy.HTTP');

/**
 * Tools to ease extraction of each header and its value
 * from the headers string
 *
 * @package Sy
 * @subpackage HTTP
 * @class
 */

Sy.HTTP.HeaderParser = function () {};

Sy.HTTP.HeaderParser.prototype = Object.create(Object.prototype, {

    /**
     * Take the string of all headers and return an object
     * as key/value pairs for each header
     *
     * @param {string} headers
     *
     * @return {object}
     */

    parse: {
        value: function (headers) {

            var obj = {},
                headersList = headers.split('\n'),
                header,
                value,
                index;

            for (var i = 0, l = headersList.length - 1; i < l; i++) {

                index = headersList[i].indexOf(':');
                header = headersList[i].substring(0, index);
                value = headersList[i].substring(index + 2);

                switch (header) {
                    case 'Date':
                    case 'Expires':
                    case 'Last-Modified':
                        value = new Date(value);
                        break;
                }

                obj[header] = value;

            }

            return obj;

        }
    }

});
namespace('Sy.HTTP');

/**
 * Object for requesting DOM elements via ajax
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Request}
 * @class
 */

Sy.HTTP.HTMLRequest = function () {

    Sy.HTTP.Request.call(this);

    this.setType('html');
    this.setHeader('Accept', 'text/html,application/xhtml+xml');

};

Sy.HTTP.HTMLRequest.prototype = Object.create(Sy.HTTP.Request.prototype);
namespace('Sy.HTTP');

/**
 * Response when HTML is returned
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Response}
 * @class
 */

Sy.HTTP.HTMLResponse = function () {

    Sy.HTTP.Response.call(this);

};

Sy.HTTP.HTMLResponse.prototype = Object.create(Sy.HTTP.Response.prototype);
namespace('Sy.HTTP');

/**
 * Accept Request objects and handle launching them,
 * it's possible to cancel them as well
 *
 * @package Sy
 * @subpackage HTTP
 * @class
 */

Sy.HTTP.Manager = function () {

    this.requests = null;
    this.parser = null;
    this.generator = null;
    this.logger = null;

};

Sy.HTTP.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set the response headers parser
     *
     * @param {object} parser
     *
     * @return {Sy.HTTP.Manager}
     */

    setParser: {
        value: function (parser) {

            this.parser = parser;

            return this;

        }
    },

    /**
     * Set an identifier generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.HTTP.Manager}
     */

    setGenerator: {
        value: function (generator) {

            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator type');
            }

            this.generator = generator;

            return this;

        }
    },

    /**
     * Set a registry holding pending requests
     *
     * @param {Sy.Registry} registry
     *
     * @return {Sy.HTTP.Manager}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.Registry)) {
                throw new TypeError('Invalid registry');
            }

            this.requests = registry;

            return this;

        }
    },

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.HTTP.Manager}
     */

    setLogger: {
        value: function (logger) {

            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;

        }
    },

    /**
     * Prepare a new HTTP request
     *
     * @param {Sy.HTTP.RequestInterface} request
     *
     * @return {string} Identifier of the request
     */

    prepare: {
        value: function (request) {

            if (!(request instanceof Sy.HTTP.RequestInterface)) {
                throw new TypeError('Invalid request type');
            }

            if (this.logger) {
                this.logger.info('Preparing a new HTTP request...', request);
            }

            var uuid = this.generator.generate(),
                req = {
                    xhr: null,
                    obj: request,
                    uuid: uuid
                },
                headers = request.getHeader(),
                data = request.getData(),
                requestData = new FormData();

            req.xhr = new XMLHttpRequest();

            req.xhr.open(
                request.getMethod(),
                request.getURI()
            );

            req.xhr.UUID = uuid;

            req.xhr.addEventListener('readystatechange', this.listener.bind(this), false);

            switch (request.getType()) {
                case 'html':
                    req.xhr.responseType = 'document';
                    break;
                case 'json':
                    req.xhr.responseType = 'json';
                    break;
            }

            for (var header in headers) {
                if (headers.hasOwnProperty(header)) {
                    req.xhr.setRequestHeader(header, headers[header]);
                }
            }

            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    requestData.append(k, data[k]);
                }
            }

            req.data = requestData;

            this.requests.set(uuid, req);

            if (this.logger) {
                this.logger.info('HTTP request prepared', req);
            }

            return uuid;

        }
    },

    /**
     * Return the XMLHttpRequest instance for the specified uuid
     *
     * @param {String} uuid
     *
     * @return {XMLHttpRequest}
     */

    getXHR: {
        value: function (uuid) {

            var req = this.requests.get(uuid);

            return req.xhr;

        }
    },

    /**
     * Launch the specified request
     * If it's a uuid, it will send the previously prepared request
     * If it's a request object, it will automatically prepare it
     *
     * @param {String|Sy.HTTP.RequestInterface} request
     *
     * @return {string} Identifier of the request
     */

    launch: {
        value: function (request) {

            if (typeof request === 'string') {
                var req = this.requests.get(request);

                if (this.logger) {
                    this.logger.info('Launching a HTTP request...', req);
                }

                req.xhr.send(req.data);

                return req.uuid;
            } else {
                return this.launch(this.prepare(request));
            }

        }
    },

    /**
     * Listener wrapper for xhr state change
     *
     * @private
     *
     * @param {XMLHttpRequestProgressEvent} event
     *
     * @return {void}
     */

    listener: {
        value: function (event) {

            if (
                event.target.readyState === event.target.DONE &&
                this.requests.has(event.target.UUID)
            ) {

                var request = this.requests.get(event.target.UUID),
                    lstn = request.obj.getListener(),
                    headers = this.parser.parse(event.target.getAllResponseHeaders()),
                    response;

                if (
                    headers['Content-Type'] !== undefined &&
                    headers['Content-Type'].indexOf('application/json') !== -1 &&
                    request.obj.getType() === 'json'
                ) {

                    response = new Sy.HTTP.JSONResponse();

                } else if (
                    headers['Content-Type'] !== undefined &&
                    headers['Content-Type'].indexOf('text/html') !== -1 &&
                    request.obj.getType() === 'html'
                ) {

                    response = new Sy.HTTP.HTMLResponse();

                } else {

                    response = new Sy.HTTP.Response();

                }

                response.setHeaders(headers);
                response.setStatusCode(event.target.status);
                response.setStatusText(event.target.statusText);

                response.setBody(event.target.response);

                this.requests.remove(event.target.UUID);

                if (lstn instanceof Function) {

                    if (this.logger) {
                        this.logger.info('Notifying the request is finished...', response);
                    }

                    lstn(response);

                }

            }

        }
    },

    /**
     * Abort a request
     *
     * @param {string} identifier
     *
     * @return {Sy.HTTP.Manager}
     */

    abort: {
        value: function (identifier) {

            var request = this.requests.get(identifier);

            request.xhr.abort();
            this.requests.remove(identifier);

            if (this.logger) {
                this.logger.info('HTTP request aborted', identifier);
            }

            return this;

        }
    }

});
namespace('Sy.HTTP');

/**
 * Wrapper to ease the process of constructing REST calls
 *
 * @package Sy
 * @subpackage HTTP
 * @class
 */

Sy.HTTP.REST = function () {

    this.manager = null;

};

Sy.HTTP.REST.prototype = Object.create(Object.prototype, {

    /**
     * Set the http manager
     *
     * @param {Sy.HTTP.Manager} manager
     *
     * @return {Sy.HTTP.REST}
     */

    setManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.HTTP.Manager)) {
                throw new TypeError('Invalid manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * Make a request to the server with as options an object as follows
     *
     * <code>
     *   {
     *       data: {
     *           input: 'input value'
     *       },
     *       headers: {
     *           headerName: 'header value'
     *       },
     *       uri: 'url/to/request',
     *       listener: 'function to call',
     *       method: 'get|post|put|delete'
     *   }
     * </code>
     *
     * Every REST response as to be a JSON document
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    request: {
        value: function (args) {

            var request = new Sy.HTTP.JSONRequest();

            args.data = args.data || {};
            args.headers = args.headers || {};

            request.setMethod(args.method);
            request.setURI(args.uri);
            request.setHeader(args.headers);
            request.setData(args.data);
            request.setListener(args.listener);

            this.manager.launch(request);

        }
    },

    /**
     * Create a GET request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    get: {
        value: function (args) {

            args.method = 'get';

            this.request(args);

            return this;

        }
    },

    /**
     * Create a POST request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    post: {
        value: function (args) {

            args.method = 'post';

            this.request(args);

            return this;

        }
    },

    /**
     * Create a PUT request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    put: {
        value: function (args) {

            args.method = 'put';
            args.data = args.data || {_method: 'put'};

            this.request(args);

            return this;

        }
    },

    /**
     * Create a DELETE request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    remove: {
        value: function (args) {

            args.method = 'delete';
            args.data = args.data || {_method: 'delete'};

            this.request(args);

            return this;

        }
    }

});
namespace('Sy');

/**
 * Interface for registries
 *
 * @package Sy
 * @interface
 */
Sy.RegistryInterface = function () {};

Sy.RegistryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a new key/value pair in the registry
     *
     * @param {string} key
     * @param {mixed} value
     *
     * @return {Sy.RegistryInterface}
     */

    set: {
        value: function (key, value) {}
    },

    /**
     * Check if the key is set in the registry
     *
     * @param {string} key
     *
     * @return {boolean}
     */

    has: {
        value: function (key) {}
    },

    /**
     * Get the value associated of the passed key
     *
     * If the key is not referenced, it will throw a ReferenceError
     * If the key is not specified, it will return an array of all values
     *
     * @param {string} key
     *
     * @return {mixed}
     */

    get: {
        value: function (key) {}
    },

    /**
     * Return all the key/value pairs
     *
     * @return {object}
     */

    getMapping: {
        value: function () {}
    },

    /**
     * Remove elements from the registry
     *
     * If a key is specified it will removed only this one.
     * If an array of keys is specified it will removed only this set.
     *
     * @param {string|Array} keys Optionnal
     *
     * @return {Sy.RegistryInterface}
     */

    remove: {
        value: function (keys) {}
    },

    /**
     * Return the number of elements held by the registry
     *
     * @return {int}
     */

    length: {
        value: function () {}
    }

});
namespace('Sy');

/**
 * Default implementation of the RegistryInterface
 * It allows to handle key/value pairs
 *
 * @package Sy
 * @implements {Sy.RegistryInterface}
 * @class
 */

Sy.Registry = function () {

    this.data = {};
    this.registryLength = 0;

};

Sy.Registry.prototype = Object.create(Sy.RegistryInterface.prototype, {

    /**
     * @inheritDoc
     */

    set: {
        value: function (key, value) {

            if (typeof key === 'string') {

                this.data[key] = value;
                this.registryLength++;

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (key) {

            if (this.data.hasOwnProperty(key)) {
                return true;
            }

            return false;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (key) {

            if (this.has(key)) {

                return this.data[key];

            } else if (key === undefined) {

                var data = [];

                for (var k in this.data) {
                    if (this.data.hasOwnProperty(k)) {
                        data.push(this.data[k]);
                    }
                }

                return data;

            }

            throw new ReferenceError('"' + key + '" is not defined');

        }
    },

    /**
     * @inheritDoc
     */

    getMapping: {
        value: function () {

            var data = {};

            for (var k in this.data) {
                if (this.data.hasOwnProperty(k)) {
                    data[k] = this.data[k];
                }
            }

            return data;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (keys) {

            if (keys === undefined) {

                for (var key in this.data) {
                    if (this.data.hasOwnProperty(key)) {
                        this.remove(key);
                    }
                }

            } else if (keys instanceof Array) {

                for (var i = 0, l = keys.length; i < l; i++) {
                    this.remove(keys[i]);
                }

            } else if (typeof keys === 'string' && this.has(keys)) {

                delete this.data[keys];
                this.registryLength--;

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    length: {
        value: function () {
            return this.registryLength;
        }
    }

});
namespace('Sy');

/**
 * Factory generating basic registry
 *
 * @package Sy
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.RegistryFactory = function () {};
Sy.RegistryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function () {
            return new Sy.Registry();
        }
    }

});
namespace('Sy');

/**
 * Interface to describe how to manipulate key/value pairs
 * in different states
 *
 * @package Sy
 * @interface
 */

Sy.StateRegistryInterface = function () {};

Sy.StateRegistryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a new element for a specific state
     *
     * @param {string} state
     * @param {string} key
     * @param {mixed} value
     *
     * @return {Sy.StateRegistryInterface}
     */

    set: {
        value: function (state, key, value) {}
    },

    /**
     * Check if the key exist in a state
     *
     * If the key is not specified, it check if any element has been set for the specified state
     *
     * @param {string} state
     * @param {string} key
     *
     * @return {boolean}
     */

    has: {
        value: function (state, key) {}
    },

    /**
     * Get an element for a specific state
     *
     * If the key is not specified, it return an array of all elements for the specific state.
     * If no parameters, it return a list of data arrays like {stateName: [data1, data2, ...], ...}
     *
     * @param {string} state
     * @param {string} key
     *
     * @return {mixed}
     */

    get: {
        value: function (state, key) {}
    },

    /**
     * Retrieve the state of a specific key
     *
     * @param {string} key
     *
     * @return {string|undefined}
     */

    state: {
        value: function (key) {}
    },

    /**
     * Remove an element in a state
     *
     * If no key specified it will remove all elements of the state
     * if no parameters it will remove all elements
     *
     * @param {string} state
     * @param {string} key
     *
     * @return {Sy.StateRegistryInterface}
     */

    remove: {
        value: function (state, key) {}
    }

});
namespace('Sy');

/**
 * Default implementation of StateRegistryInterface
 *
 * @package Sy
 * @implements {Sy.StateRegistryInterface}
 * @class
 */

Sy.StateRegistry = function () {

    this.data = null;
    this.states = [];
    this.registryFactory = null;

};

Sy.StateRegistry.prototype = Object.create(Sy.StateRegistryInterface.prototype, {

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.StateRegistry}
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid factory');
            }

            this.registryFactory = factory;
            this.data = factory.make();

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    set: {
        value: function (state, key, value) {

            if (!this.has(state)) {

                var r = this.registryFactory.make();

                this.data.set(state, r);
                this.states.push(state);

            }

            this.data
                .get(state)
                .set(key, value);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (state, key) {

            if (key === undefined && this.data.has(state)) {
                return true;
            }

            if (this.data.has(state) && this.data.get(state).has(key)) {
                return true;
            }

            return false;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (state, key) {

            switch (arguments.length) {
                case 2:
                    if (this.has(state, key)) {
                        return this.data.get(state).get(key);
                    }
                    break;
                case 1:
                    if (this.has(state)) {
                        return this.data.get(state).get();
                    }
                    break;
                case 0:
                    var data = {};

                    for (var s in this.states) {
                        if (this.states.hasOwnProperty(s)) {
                            data[this.states[s]] = this.data.get(this.states[s]).get();
                        }
                    }

                    return data;
            }

            throw new ReferenceError('"' + key + '" does not exist in "' + state + '" state');

        }
    },

    /**
     * @inheritDoc
     */

    state: {
        value: function (key) {

            var states = [];

            for (var s in this.states) {
                if (this.data.get(this.states[s]).has(key)) {
                    states.push(this.states[s]);
                }
            }

            switch (states.length) {
                case 0:
                    return undefined;
                case 1:
                    return states[0];
                default:
                    return states;
            }

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (state, key) {

            if (state === undefined) {
                for (var i = 0, l = this.states.length; i < l; i++) {
                    this.remove(this.states[i]);
                }
            } else {
                this.data.get(state).remove(key);
            }

            return this;

        }
    }

});
namespace('Sy');

/**
 * Factory generating state registry objects
 *
 * @package Sy
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.StateRegistryFactory = function () {

    this.registryFactory = null;

};
Sy.StateRegistryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.StateRegistryFactory}
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid factory');
            }

            this.registryFactory = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function () {

            var q = new Sy.StateRegistry();

            q.setRegistryFactory(this.registryFactory);

            return q;

        }
    }

});
namespace('Sy.Storage');

/**
 * Interface showing how a repository must handle entities
 * Each Entity Repository must implement this interface
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 */

Sy.Storage.RepositoryInterface = function () {};

Sy.Storage.RepositoryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a unit of work to handle modifications of entities
     *
     * @param {Sy.Storage.UnitOfWork} uow
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setUnitOfWork: {
        value: function (uow) {}
    },

    /**
     * Set the entity cache registry
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setCacheRegistry: {
        value: function (registry) {}
    },

    /**
     * Set the alias name of entities handled by the repository
     *
     * @param {string} name
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Set the storage engine
     *
     * @param {Sy.Storage.EngineInterface} engine
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setEngine: {
        value: function (engine) {}
    },

    /**
     * Set the entity property acting as identifier
     *
     * @param {string} key
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setEntityKey: {
        value: function (key) {}
    },

    /**
     * Set the constructor for the handled entity
     *
     * @param {Sy.EntityInterface} constructor Entity constructor
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setEntityConstructor: {
        value: function (constructor) {}
    },

    /**
     * Set the indexes of the entity
     *
     * @param {Array} indexes
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setIndexes: {
        value: function (indexes) {}
    },

    /**
     * Set the identifier generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setGenerator: {
        value: function (generator) {}
    },

    /**
     * Persist a new entity
     *
     * If trying to persist an entity not handled by the repo, raise a TypeError
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    persist: {
        value: function (entity) {}
    },

    /**
     * Remove an entity
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    remove: {
        value: function (entity) {}
    },

    /**
     * Apply the changes to the storage (create/update/delete)
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    flush: {
        value: function () {}
    },

    /**
     * Find one entity in the storage
     * Only indexes can be searchable
     *
     * @param {object} args Allowed properties: index, value, callback
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    findOneBy: {
        value: function (args) {}
    },

    /**
     * Find a set of entities in the storage
     * Only indexes can be searchable
     *
     * @param {object} args Allowed properties: index, value, callback
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    findBy: {
        value: function (args) {}
    }

});
namespace('Sy.Storage');

/**
 * Interface explaining how the engines must work
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 * @param {mixed} meta Informations about the engine
 */

Sy.Storage.EngineInterface = function (meta) {};

Sy.Storage.EngineInterface.prototype = Object.create(Object.prototype, {

    /**
     * Add a new store in the engine (where objects will be putted)
     *
     * @param {string} alias Callable store
     * @param {string} name Actual name used to construct the store
     * @param {string} identifier Property used as identifier
     * @param {Array} indexes
     *
     * @return {Sy.Storage.EngineInterface}
     */

    setStore: {
        value: function (alias, name, identifier, indexes) {}
    },

    /**
     * Retrieve an item by its identifier
     *
     * @param {string} store Alias name of the store
     * @param {string} identifier
     * @param {function} callback Called when the item is retrieved with the whole object as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    read: {
        value: function (store, identifier, callback) {}
    },

    /**
     * Create a new element
     *
     * @param {string} store Alias name of the store
     * @param {object} object
     * @param {function} callback Called when the item is created with its id as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    create: {
        value: function (store, object, callback) {}
    },

    /**
     * Update an element in the storage
     *
     * @param {string} store Alias name of the store
     * @param {string} identifier Object identifier
     * @param {object} object
     * @param {function} callback Called when the item is updated with the whole object as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    update: {
        value: function (store, identifier, object, callback) {}
    },

    /**
     * Remove an element from the storage
     *
     * @param {string} store Alias name of the store
     * @param {string} identifier
     * @param {function} callback Called when the item is deleted with the id as argument
     *
     * @return {Sy.Storage.EngineInterface}
     */

    remove: {
        value: function (store, identifier, callback) {}
    },

    /**
     * Find (an) element(s) in the storage
     *
     * @param {string} store Alias name of the store
     * @param {object} args Available properties: index, value, limit, callback
     *
     * @return {Sy.Storage.EngineInterface}
     */

    find: {
        value: function (store, args) {}
    }

});
namespace('Sy.Storage');

/**
 * Interface to define how to transform entities metadata
 * into store informations readable by a storage engine
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 */

Sy.Storage.StoreMapperInterface = function () {};
Sy.Storage.StoreMapperInterface.prototype = Object.create(Object.prototype, {

    /**
     * Transform an entity metadata into store metadata
     *
     * @param {Object} meta
     *
     * @return {Object}
     */

    transform: {
        value: function (meta) {}
    }

});

namespace('Sy.Storage');

/**
 * Main entrance to access storage functionalities
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.Core = function () {

    this.managers = null;

};

Sy.Storage.Core.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry holding the managers
     *
     * @param {Sy.Registry} registry
     *
     * @return {Sy.Storage.Core}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.Registry)) {
                throw new TypeError('Invalid registry');
            }

            this.managers = new Sy.Registry();

            return this;

        }
    },

    /**
     * Set a new manager
     *
     * @param {string} name
     * @param {Sy.Storage.Manager} manager
     *
     * @return {Sy.Storage.Core}
     */

    setManager: {
        value: function (name, manager) {

            if (!(manager instanceof Sy.Storage.Manager)) {
                throw new TypeError('Invalid manager type');
            }

            this.managers.set(name, manager);

            return this;

        }
    },

    /**
     * Get a manager
     *
     * If the name is not specified it is set to main
     *
     * @param {string} manager
     *
     * @return {Sy.Storage.Manager}
     */

    getManager: {
        value: function (manager) {

            manager = manager || 'main';

            return this.managers.get(manager);

        }
    }

});
namespace('Sy.Storage.Event');

/**
 * Event fired when modification happens at the storage engine level
 * meaning create/update/remove actions are called
 *
 * @package Sy
 * @subpackage Storage.Event
 * @class
 */

Sy.Storage.Event.LifecycleEvent = function (storageName, storeName, identifier, object) {
    this.storageName = storageName;
    this.storeName = storeName;
    this.identifier = identifier;
    this.object = object;
};
Sy.Storage.Event.LifecycleEvent.prototype = Object.create(Object.prototype, {

    PRE_CREATE: {
        value: 'storage::on::pre::create',
        writable: false
    },

    POST_CREATE: {
        value: 'storage::on::post::create',
        writable: false
    },

    PRE_UPDATE: {
        value: 'storage::on::pre:update',
        writable: false
    },

    POST_UPDATE: {
        value: 'storage::on::post::update',
        writable: false
    },

    PRE_REMOVE: {
        value: 'storage::on::pre::remove',
        writable: false
    },

    POST_REMOVE: {
        value: 'storage::on::post::remove',
        writable: false
    },

    /**
     * Return the storage name of the storage engine
     *
     * @return {String}
     */

    getStorageName: {
        value: function () {
            return this.storageName;
        }
    },

    /**
     * Return the store name of the data being manipulated
     *
     * @return {String}
     */

    getStoreName: {
        value: function () {
            return this.storeName;
        }
    },

    /**
     * Return the identifier of the object being manipulated,
     * available for update and remove events
     *
     * @return {String}
     */

    getIdentifier: {
        value: function () {
            return this.identifier;
        }
    },

    /**
     * Return the data being manipulated
     *
     * @return {Object}
     */

    getData: {
        value: function () {
            return this.object;
        }
    }

});

namespace('Sy.Storage.Engine');

/**
 * Engine persisiting data to the IndexedDB html5 API
 *
 * @package Sy
 * @subpackage Storage.Engine
 * @implements {Sy.Storage.EngineInterface}
 * @class
 */

Sy.Storage.Engine.IndexedDB = function (version) {

    this.version = version;
    this.connection = null;
    this.transaction = null;
    this.keyRange = null;
    this.transactionModes = {
        READ_ONLY: null,
        READ_WRITE: null
    };
    this.name = 'app::storage';
    this.stores = {};
    this.storage = null;
    this.logger = null;
    this.mediator = null;

};

Sy.Storage.Engine.IndexedDB.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {

    /**
     * Set the connection object to IndexedDB
     *
     * @param {IDBFactory} connection
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    setConnection: {
        value: function (connection) {

            if (!(connection instanceof IDBFactory)) {
                throw new TypeError('Invalid connection');
            }

            this.connection = connection;

            return this;

        }
    },

    /**
     * Set transaction object
     *
     * @param {IDBTransaction} transaction
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    setTransaction: {
        value: function (transaction) {

            this.transaction = transaction;
            this.transactionModes = {
                READ_ONLY: this.transaction.READ_ONLY || 'readonly',
                READ_WRITE: this.transaction.READ_WRITE || 'readwrite'
            };

            return this;

        }
    },

    /**
     * Set key range object
     *
     * @param {IDBKeyRange} keyrange
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    setKeyRange: {
        value: function (keyrange) {

            this.keyRange = keyrange;

            return this;

        }
    },

    /**
     * Set the database name
     * Default is "app::storage"
     *
     * @param {string} name
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    /**
     * Set a logger object
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    setLogger: {
        value: function (logger) {

            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;

        }
    },

    /**
     * Set the mediator object
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Storage.EngineIndexedDB}
     */

    setMediator: {
        value: function (mediator) {

            this.mediator = mediator;

            return this;

        }
    },

    /**
     * Open a connection to the database
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    open: {
        value: function () {

            var request = this.connection.open(this.name, this.version);

            request.onupgradeneeded = this.upgradeDatabase.bind(this);
            request.onsuccess = function (event) {

                this.storage = event.target.result;
                this.storage.onerror = function (event) {
                    this.logger.error('Database operation failed', event);
                }.bind(this);

                this.logger.info('Database opened');

            }.bind(this);
            request.onerror = function (event) {
                this.logger.error('Database opening failed', event);
            }.bind(this);
            request.onblocked = function (event) {
                this.logger.error('Database opening failed! (blocked by browser setting)', event);
            }.bind(this);

            return this;

        }
    },

    /**
     * Upgrade the definition of the database
     *
     * @private
     * @param {object} event
     *
     * @return {Sy.Storage.Engine.IndexedDB}
     */

    upgradeDatabase: {
        value: function (event) {

            this.logger.info('Upgrading database...');

            this.storage = event.target.result;

            for (var store in this.stores) {
                if (this.stores.hasOwnProperty(store)) {

                    var objectStore;

                    store = this.stores[store];

                    if (!this.storage.objectStoreNames.contains(store.path)) {
                        this.storage.createObjectStore(
                            store.path,
                            {
                                keyPath: store.key,
                                autoincrement: false
                            }
                        );
                    }

                    objectStore = event.target.transaction.objectStore(store.path);

                    for (var i = 0, l = objectStore.indexNames.length; i < l; i++) {
                        if (store.indexes.indexOf(objectStore.indexNames[i]) === -1) {
                            objectStore.deleteIndex(objectStore.indexNames[i]);
                        }
                    }

                    for (var j = 0, jl = store.indexes.length; j < jl; j++) {
                        if (!objectStore.indexNames.contains(store.indexes[j])) {
                            objectStore.createIndex(
                                store.indexes[j],
                                store.indexes[j],
                                {unique: false}
                            );
                        }
                    }

                }
            }

        }
    },

    /**
     * @inheritDoc
     */

    setStore: {
        value: function (alias, name, identifier, indexes) {

            this.stores[alias] = {
                path: name,
                key: identifier,
                indexes: indexes
            };

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (storeName, identifier, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Invalid store');
            }

            var store = this.stores[storeName];

            try {

                var transaction = this.storage.transaction(
                        [store.path],
                        this.transactionModes.READ_ONLY
                    ),
                    objectStore = transaction.objectStore(store.path),
                    request = objectStore.get(identifier);

                request.addEventListener('success', function (event) {
                    callback(event.target.result);
                }.bind(this));

                request.addEventListener('error', function (event) {
                    this.logger.error('Read operation failed!', event);
                }.bind(this));

            } catch (e) {

                this.logger.error('Read operation failed!', e);

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (storeName, object, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Invalid store');
            }

            var store = this.stores[storeName],
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.name,
                    storeName,
                    null,
                    object
                );

            try {

                this.mediator.publish(
                    evt.PRE_CREATE,
                    evt
                );

                var transaction = this.storage.transaction(
                        [store.path],
                        this.transactionModes.READ_WRITE
                    ),
                    objectStore = transaction.objectStore(store.path),
                    request = objectStore.put(object);

                request.addEventListener('success', function (event) {
                    callback(event.target.result);
                    this.mediator.publish(
                        evt.POST_CREATE,
                        evt
                    );
                }.bind(this));

                request.addEventListener('error', function (event) {
                    this.logger.error('Create operation failed!', event);
                }.bind(this));

            } catch (e) {

                this.logger.error('Create operation failed!', e);

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, identifier, object, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Invalid store');
            }

            var store = this.stores[storeName],
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.name,
                    storeName,
                    identifier,
                    object
                );

            try {

                this.mediator.publish(
                    evt.PRE_UPDATE,
                    evt
                );

                var transaction = this.storage.transaction(
                        [store.path],
                        this.transactionModes.READ_WRITE
                    ),
                    objectStore = transaction.objectStore(store.path),
                    request = objectStore.put(object);

                request.addEventListener('success', function (event) {
                    callback(event.target.result);
                    this.mediator.publish(
                        evt.POST_UPDATE,
                        evt
                    );
                }.bind(this));

                request.addEventListener('error', function (event) {
                    this.logger.error('Update operation failed!', event);
                }.bind(this));

            } catch (e) {

                this.logger.error('Update operation failed!', e);

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, identifier, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Invalid store');
            }

            var store = this.stores[storeName],
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.name,
                    storeName,
                    identifier,
                    null
                );

            try {

                this.mediator.publish(
                    evt.PRE_REMOVE,
                    evt
                );

                var transaction = this.storage.transaction(
                        [store.path],
                        this.transactionModes.READ_WRITE
                    ),
                    objectStore = transaction.objectStore(store.path),
                    request = objectStore.delete(identifier);

                request.addEventListener('success', function (event) {
                    callback(event.target.result);
                    this.mediator.publish(
                        evt.POST_REMOVE,
                        evt
                    );
                }.bind(this));

                request.addEventListener('error', function (event) {
                    this.logger.error('Delete operation failed!', event);
                }.bind(this));

            } catch (e) {

                this.logger.error('Delete operation failed!', e);

            }

            return this;

        }
    },

    /**
     * Find (an) element(s) in the storage
     *
     * @param {string} store Alias name of the store
     * @param {object} args Available properties: index, value, limit, callback
     *
     * @return {Sy.Storage.EngineInterface}
     */

    find: {
        value: function (store, args) {

            if (!this.stores[store]) {
                throw new ReferenceError('Invalid store');
            }

            store = this.stores[store];

            try {

                var transaction = this.storage.transaction(
                        [store.path],
                        this.transactionModes.READ_ONLY
                    ),
                    objectStore = transaction.objectStore(store.path),
                    index = objectStore.index(args.index),
                    results = [],
                    keyRange,
                    request;

                if (args.value instanceof Array && args.value.length === 2) {

                    if (args.value[0] === undefined) {
                        keyRange = this.keyRange.upperBound(args.value[1]);
                    } else if (args.value[1] === undefined) {
                        keyRange = this.keyRange.lowerBound(args.value[0]);
                    } else {
                        keyRange = this.keyRange.bound(args.value[0], args.value[1]);
                    }

                } else {
                    keyRange = this.keyRange.only(args.value);
                }

                request = index.openCursor(keyRange);

                request.addEventListener('success', function (event) {

                    var result = event.target.result;

                    if (!!result === false) {
                        if (args.limit) {
                            args.callback(results.slice(0, args.limit));
                        } else {
                            args.callback(results);
                        }
                        return;
                    }

                    results.push(result.value);
                    result.continue();

                });

                request.addEventListener('error', function (event) {
                    this.logger.error('Search operation failed!', event);
                }.bind(this));

            } catch (e) {

                this.logger.error('Search operation failed!', e);

            }

            return this;

        }
    }

});
namespace('Sy.Storage.Engine');

/**
 * Storage engine persisting data into browser LocalStorage API
 *
 * @package Sy
 * @subpackage Storage.Engine
 * @implements {Sy.Storage.EngineInterface}
 * @class
 */

Sy.Storage.Engine.Localstorage = function (version) {

    if (!JSON) {
        throw new Error('JSON object missing! Please load a polyfill in order to use this engine!');
    }

    this.storage = null;
    this.stores = {};
    this.data = null;
    this.storageKey = 'app::storage';
    this.mediator = null;

};

Sy.Storage.Engine.Localstorage.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {

    /**
     * Set the storage key in LocalStorage
     * If not set, it will use "app::storage"
     *
     * @param {string} storageKey
     *
     * @return {Sy.Storage.Engine.Localstorage}
     */

    setStorageKey: {
        value: function (storageKey) {

            this.storageKey = storageKey;

            return this;

        }
    },

    /**
     * Set the LocalStorage API object
     *
     * @param {object} storage
     *
     * @return {Sy.Storage.Engine.Localstorage}
     */

    setStorage: {
        value: function (storage) {

            this.storage = storage;

            return this;

        }
    },

    /**
     * Set mediator object
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Storage.Engine.Localstorage}
     */

    setMediator: {
        value: function (mediator) {

            this.mediator = mediator;

            return this;

        }
    },

    /**
     * Load data stored in the browser
     * If first time loaded, it creates the storage
     *
     * @return {Sy.Storage.Engine.Localstorage}
     */

    open: {
        value: function () {

            if (!this.storage) {
                throw new Error('Storage API object missing');
            }

            var data = this.storage.getItem(this.storageKey);

            if (!data) {
                this.createStorage();
            } else {
                this.data = JSON.parse(data);
            }

            return this;

        }
    },

    /**
     * Create the storage
     *
     * @private
     * @return {Sy.Storage.Engine.Localstorage}
     */

    createStorage: {
        value: function () {

            this.data = {};

            for (var store in this.stores) {
                if (this.stores.hasOwnProperty(store)) {
                    this.data[this.stores[store].path] = {};
                }
            }

            this.flush();

            return this;

        }
    },

    /**
     * Write all the data to the LocalStorage
     *
     * @private
     * @return {Sy.Storage.Engine.Localstorage}
     */

    flush: {
        value: function () {

            this.storage.setItem(this.storageKey, JSON.stringify(this.data));

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setStore: {
        value: function (alias, name, identifier, indexes) {

            this.stores[alias] = {
                path: name,
                key: identifier,
                indexes: indexes
            };

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (storeName, identifier, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var store = this.stores[storeName];

            if (this.data[store.path][identifier]) {
                setTimeout(
                    callback,
                    0,
                    this.data[store.path][identifier]
                );
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (storeName, object, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var store = this.stores[storeName],
                key = store.key,
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.storageKey,
                    storeName,
                    null,
                    object
                );

            this.mediator.publish(
                evt.PRE_CREATE,
                evt
            );

            this.data[store.path][object[key]] = object;

            this.flush();

            this.mediator.publish(
                evt.POST_CREATE,
                evt
            );

            setTimeout(
                callback,
                0,
                object[key]
            );

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, identifier, object, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var store = this.stores[storeName],
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.storageKey,
                    storeName,
                    identifier,
                    object
                );

            this.mediator.publish(
                evt.PRE_UPDATE,
                evt
            );

            this.data[store.path][identifier] = object;

            this.flush();

            this.mediator.publish(
                evt.POST_UPDATE,
                evt
            );

            setTimeout(
                callback,
                0,
                object
            );

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, identifier, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var store = this.stores[storeName],
                key = store.key,
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.storageKey,
                    storeName,
                    identifier,
                    null
                );

            this.mediator.publish(
                evt.PRE_REMOVE,
                evt
            );

            delete this.data[store.path][identifier];

            this.flush();

            this.mediator.publish(
                evt.POST_REMOVE,
                evt
            );

            setTimeout(
                callback,
                0,
                identifier
            );

            return this;

        }
    },

    /**
     * Find (an) element(s) in the storage
     *
     * @param {string} store Alias name of the store
     * @param {object} args Available properties: index, value, limit, callback
     *
     * @return {Sy.Storage.EngineInterface}
     */

    find: {
        value: function (store, args) {

            if (!this.stores[store]) {
                throw new ReferenceError('Unknown store');
            }

            store = this.stores[store];

            var data = [];

            for (var key in this.data[store.path]) {
                if (this.data[store.path].hasOwnProperty(key)) {

                    var d = this.data[store.path][key];

                    if (args.value instanceof Array) {

                        if (
                            (
                                args.value[0] === undefined &&
                                d[args.index] <= args.value[1]
                            ) ||
                            (
                                args.value[1] === undefined &&
                                d[args.index] >= args.value[0]
                            ) ||
                            (
                                d[args.index] >= args.value[0] &&
                                d[args.index] <= args.value[1]
                            )
                        ) {
                            data.push(d);
                        }

                    } else if (d[args.index] === args.value) {
                        data.push(d);
                    }

                }
            }

            if (args.limit) {
                data = data.slice(0, args.limit);
            }

            setTimeout(
                args.callback,
                0,
                data
            );

            return this;

        }
    }

});
namespace('Sy.Storage.Engine');

/**
 * Storage engine sending data to a HTTP API via REST calls
 *
 * @package Sy
 * @subpackage Storage.Engine
 * @implements {Sy.Storage.EngineInterface}
 * @class
 */

Sy.Storage.Engine.Rest = function (version) {

    this.version = version || 1;
    this.stores = {};
    this.manager = null;
    this.basePath = '';
    this.mediator = null;
    this.headers = {};
    this.name = 'app::storage';

};

Sy.Storage.Engine.Rest.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {

    /**
     * Set the pattern of the api url
     * The pattern must at least contain "{{path}}" and "{{key}}" placeholders
     * An extra "{{version}}" placeholder can be set
     *
     * @param {string} pattern
     *
     * @return {Sy.Storage.Engine.Rest}
     */

    setPattern: {
        value: function (pattern) {

            if (pattern.indexOf('{{path}}') === -1 || pattern.indexOf('{{key}}') === -1) {
                throw new SyntaxError('Invalid pattern');
            }

            this.basePath = pattern.replace(/{{version}}/, this.version);

            return this;

        }
    },

    /**
     * Set the rest manager
     *
     * @param {Sy.HTTP.REST} manager
     *
     * @return {Sy.Storage.Engine.Rest}
     */

    setManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * Set mediator object
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Storage.Engine.Rest}
     */

    setMediator: {
        value: function (mediator) {

            this.mediator = mediator;

            return this;

        }
    },

    /**
     * Set the headers that will be associated to every request made by the engine
     * Useful to set authentication tokens
     *
     * @param {Object} headers
     *
     * @return {Sy.Storage.Engine.Rest}
     */

    setHeaders: {
        value: function (headers) {
            this.headers = headers;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setStore: {
        value: function (alias, name, identifier, indexes) {

            this.stores[alias] = {
                path: name,
                key: identifier,
                indexes: indexes
            };

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (storeName, identifier, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[storeName];

            this.manager.get({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, identifier),
                headers: this.headers,
                listener: function (resp) {

                    callback(resp.getBody());

                }
            });

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (storeName, object, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[storeName],
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.name,
                    storeName,
                    null,
                    object
                );

            this.mediator.publish(
                evt.PRE_CREATE,
                evt
            );

            this.manager.post({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, ''),
                headers: this.headers,
                data: object,
                listener: function (resp) {

                    callback(resp.getBody());

                    this.mediator.publish(
                        evt.POST_CREATE,
                        evt
                    );

                }.bind(this)
            });

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, identifier, object, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[storeName],
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.name,
                    storeName,
                    identifier,
                    object
                );

            this.mediator.publish(
                evt.PRE_UPDATE,
                evt
            );

            this.manager.put({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, identifier),
                headers: this.headers,
                data: object,
                listener: function (resp) {

                    callback(resp.getBody());

                    this.mediator.publish(
                        evt.POST_UPDATE,
                        evt
                    );

                }.bind(this)
            });

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, identifier, callback) {

            if (!this.stores[storeName]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[storeName],
                evt = new Sy.Storage.Event.LifecycleEvent(
                    this.name,
                    storeName,
                    identifier,
                    null
                );

            this.mediator.publish(
                evt.PRE_REMOVE,
                evt
            );

            this.manager.remove({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, identifier),
                headers: this.headers,
                listener: function (resp) {

                    callback(identifier);

                    this.mediator.publish(
                        evt.POST_REMOVE,
                        evt
                    );

                }.bind(this)
            });

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    find: {
        value: function (args) {

            if (!this.stores[store]) {
                throw new ReferenceError('Unknown store');
            }

            var meta = this.stores[store],
                queries = [];

            if (args.value instanceof Array) {
                queries.push(args.index + '[]=' + args.value[0] + '&' + args.index + '[]=' + args.value[1]);
            } else {
                queries.push(args.index + '=' + args.value);
            }

            if (args.limit) {
                queries.push('limit=' + args.limit);
            }

            this.manager.get({
                uri: this.basePath
                    .replace(/{{path}}/, meta.path)
                    .replace(/{{key}}/, '?' + queries.join('&')),
                headers: this.headers,
                listener: function (resp) {

                    callback(resp.getBody());

                }
            });

            return this;

        }
    }

});
namespace('Sy.Storage.EngineFactory');

/**
 * Abstract factory doing nothing, it juste centralize logger + mediator setters
 *
 * @package Sy
 * @subpackage Storage.EngineFactory
 * @class
 * @implements {Sy.FactoryInterface}
 * @abstract
 */

Sy.Storage.EngineFactory.AbstractFactory = function () {
    this.logger = null;
    this.mediator = null;
};
Sy.Storage.EngineFactory.AbstractFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.EngineFactory.IndexedDBFactory}
     */

    setLogger: {
        value: function (logger) {

            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;

        }
    },

    /**
     * Set the mediator
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Storage.EngineFactory.IndexedDBFactory}
     */

    setMediator: {
        value: function (mediator) {

            if (!(mediator instanceof Sy.Lib.Mediator)) {
                throw new TypeError('Invalid mediator');
            }

            this.mediator = mediator;

            return this;

        }
    }

});

namespace('Sy.Storage.EngineFactory');

/**
 * Master factory to generate any king of engine based on other engine factories
 *
 * @package Sy
 * @subpackage Storage.EngineFactory
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.EngineFactory.Core = function () {
    this.engines = null;
};
Sy.Storage.EngineFactory.Core.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set a registry to hold engine facctories
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.EngineFactory.Core}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.engines = registry;

            return this;

        }
    },

    /**
     * Set a new engine factory
     *
     * @param {String} name Engine name it generates
     * @param {Sy.FactoryInterface} factory Engine factory
     * @param {Sy.Storage.StoreMapperInterface} mapper
     *
     * @return {Sy.Storage.EngineFactory.Core}
     */

    setEngineFactory: {
        value: function (name, factory, mapper) {

            if (this.engines.has(name)) {
                throw new ReferenceError('Factory "' + name + '" already defined');
            }

            if (!(factory instanceof Sy.FactoryInterface)) {
                throw new TypeError('Invalid factory');
            }

            if (!(mapper instanceof Sy.Storage.StoreMapperInterface)) {
                throw new TypeError('Invalid mapper');
            }

            this.engines.set(name, {
                factory: factory,
                mapper: mapper
            });

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (managerConf, entitiesMetadata) {

            var name = managerConf.type;

            if (!this.engines.has(name)) {
                throw new ReferenceError('Unknown factory named "' + name + '"');
            }

            var factory = this.engines.get(name).factory,
                mapper = this.engines.get(name).mapper,
                stores = [],
                engine;

            for (var i = 0, l = entitiesMetadata.length; i < l; i++) {
                stores.push(mapper.transform(entitiesMetadata[i]));
            }

            engine = factory.make(
                managerConf.storageName,
                managerConf.version,
                stores
            );

            return engine;

        }
    }

});

namespace('Sy.Storage.EngineFactory');

/**
 * Generates an instance of an indexedDB storage engine
 *
 * @package Sy
 * @subpackage Storage.EngineFactory
 * @class
 * @extends {Sy.Storage.EngineFactory.AbstractFactory}
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.EngineFactory.IndexedDBFactory = function () {
    Sy.Storage.EngineFactory.AbstractFactory.call(this);
};
Sy.Storage.EngineFactory.IndexedDBFactory.prototype = Object.create(Sy.Storage.EngineFactory.AbstractFactory.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, version, stores) {

            name = name || 'app::storage';
            version = version || 1;
            stores = stores || [];

            var engine = new Sy.Storage.Engine.IndexedDB(version);

            for (var i = 0, l = stores.length; i < l; i++) {
                engine.setStore(
                    stores[i].alias,
                    stores[i].name,
                    stores[i].identifier,
                    stores[i].indexes
                );
            }

            if (this.logger) {
                engine.setLogger(this.logger);
            }

            if (this.mediator) {
                engine.setMediator(this.mediator);
            }

            engine
                .setConnection(
                    window.indexedDB ||
                    window.webkitIndexedDB ||
                    window.mozIndexedDB ||
                    window.msIndexedDB
                )
                .setTransaction(
                    window.IDBTransaction ||
                    window.webkitIDBTransaction
                )
                .setKeyRange(
                    window.IDBKeyRange ||
                    window.webkitIDBKeyRange
                )
                .open();

            return engine;

        }
    }

});

namespace('Sy.Storage.EngineFactory');

/**
 * Generates an instance of a Localstorage engine
 *
 * @package Sy
 * @subpackage Storage.EngineFactory
 * @class
 * @extends {Sy.Storage.EngineFactory.AbstractFactory}
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.EngineFactory.LocalstorageFactory = function () {
    Sy.Storage.EngineFactory.AbstractFactory.call(this);
};
Sy.Storage.EngineFactory.LocalstorageFactory.prototype = Object.create(Sy.Storage.EngineFactory.AbstractFactory.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, version, stores) {

            name = name || 'app::storage';
            version = version || 1;
            stores = stores || [];

            var engine = new Sy.Storage.Engine.Localstorage(version);

            for (var i = 0, l = stores.length; i < l; i++) {
                engine.setStore(
                    stores[i].alias,
                    stores[i].name,
                    stores[i].identifier,
                    stores[i].indexes
                );
            }

            if (this.mediator) {
                engine.setMediator(this.mediator);
            }

            engine
                .setStorage(window.localStorage)
                .open();

            return engine;

        }
    }

});

namespace('Sy.Storage.EngineFactory');

/**
 * Generates an instance of a rest storage engine
 *
 * @package Sy
 * @subpackage Storage.EngineFactory
 * @class
 * @extends {Sy.Storage.EngineFactory.AbstractFactory}
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.EngineFactory.RestFactory = function () {
    Sy.Storage.EngineFactory.AbstractFactory.call(this);
    this.manager = null;
    this.pattern = '/api/{{version}}/{{path}}/{{key}}';     //right now the pattern is not customisable
};
Sy.Storage.EngineFactory.RestFactory.prototype = Object.create(Sy.Storage.EngineFactory.AbstractFactory.prototype, {

    /**
     * Set the rest manager
     *
     * @param {Sy.HTTP.REST} manager
     *
     * @return {Sy.Storage.EngineFactory.RestFactory}
     */

    setManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid rest manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, version, stores) {

            version = version || 1;
            stores = stores || [];

            var engine = new Sy.Storage.Engine.Rest(version);

            for (var i = 0, l = stores.length; i < l; i++) {
                engine.setStore(
                    stores[i].alias,
                    stores[i].name,
                    stores[i].identifier,
                    stores[i].indexes
                );
            }

            if (this.mediator) {
                engine.setMediator(this.mediator);
            }

            engine
                .setManager(this.manager)
                .setPattern(this.pattern);

            return engine;

        }
    }

});

namespace('Sy.Storage');

/**
 * Handles a set of Entities Repository and control when to apply
 * changes to the engine
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.Manager = function () {

    this.repositoryFact = null;
    this.mapping = [];
    this.engine = null;

};

Sy.Storage.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set the repository factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     *
     * @return {Sy.Storage.Manager}
     */

    setRepositoryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory type');
            }

            this.repositoryFact = factory;

            return this;

        }
    },

    /**
     * Set the list of repository that the manager can handle
     *
     * If set to an empty array, there will be no restrictions
     *
     * @param {Array} list
     *
     * @return {Sy.Storage.Manager}
     */

    setMapping: {
        value: function (list) {

            if (!(list instanceof Array)) {
                throw new TypeError('Invalid argument');
            }

            this.mapping = list;

            return this;

        }
    },

    /**
     * Set the engine associated to the manager
     *
     * @param {Sy.Storage.EngineInterface} engine
     *
     * @return {Sy.Storage.Manager}
     */

    setEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.Storage.EngineInterface)) {
                throw new TypeError('Invalid engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * Return the engine
     * Can be useful when the dev want to add the headers for the http engine
     *
     * @return {Sy.Storage.EngineInterface}
     */

    getEngine: {
        value: function () {
            return this.engine;
        }
    },

    /**
     * Return an entity repository
     *
     * @param {string} alias
     *
     * @return {Sy.Storage.Repository}
     */

    getRepository: {
        value: function (alias) {

            if (this.mapping.length > 0 && this.mapping.indexOf(alias) === -1) {
                throw new ReferenceError('The manager does not handle "' + alias + '"');
            }

            var repo = this.repositoryFact.make(alias);

            repo.setEngine(this.engine);

            return repo;

        }
    }

});
namespace('Sy.Storage');

/**
 * Build new storage managers
 *
 * @package Sy
 * @subpackage Storage
 * @implements {Sy.FactoryInterface}
 * @class
 */

Sy.Storage.ManagerFactory = function () {

    this.engineFact = null;
    this.repositoryFact = null;

};

Sy.Storage.ManagerFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the engine factory
     *
     * @param {Sy.Storage.EngineFactory.Core} factory
     *
     * @return {Sy.Storage.ManagerFactory}
     */

    setEngineFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.Storage.EngineFactory.Core)) {
                throw new TypeError('Invalid engine factory');
            }

            this.engineFact = factory;

            return this;

        }
    },

    /**
     * Set the Repository factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     *
     * @return {Sy.Storage.ManagerFactory}
     */

    setRepositoryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }

            this.repositoryFact = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, args, entitiesMeta) {

            var manager = new Sy.Storage.Manager(),
                meta = [],
                engine;

                args.mapping = args.mapping || [];

            for (var i = 0, l = entitiesMeta.length; i < l; i++) {
                if (args.mapping.length === 0 || args.mapping.indexOf(entitiesMeta[i].name) !== -1) {
                    meta.push(entitiesMeta[i]);
                }
            }

            engine = this.engineFact.make(args, meta);

            manager
                .setRepositoryFactory(this.repositoryFact)
                .setMapping(args.mapping)
                .setEngine(engine);

            return manager;

        }
    }

});
namespace('Sy.Storage');

/**
 * Default implementation of the entity repository
 *
 * @package Sy
 * @subpackage Storage
 * @implements {Sy.Storage.RepositoryInterface}
 * @class
 */

Sy.Storage.Repository = function () {

    this.engine = null;
    this.entityKey = null;
    this.entityConstructor = null;
    this.uow = null;
    this.name = null;
    this.cache = null;

};

Sy.Storage.Repository.prototype = Object.create(Sy.Storage.RepositoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    setUnitOfWork: {
        value: function (uow) {

            if (!(uow instanceof Sy.Storage.UnitOfWork)) {
                throw new TypeError('Invalid unit of work');
            }

            this.uow = uow;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setCacheRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.cache = registry;

            return this;

        }
    },

    /**
     * Return the unit of work
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    getUnitOfWork: {
        value: function () {
            return this.uow;
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
    },

    /**
     * @inheritDoc
     */

    setEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.Storage.EngineInterface)) {
                throw new TypeError('Invalid engine');
            }

            this.engine = engine;
            this.uow.setEngine(engine);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setEntityKey: {
        value: function (key) {

            this.entityKey = key;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setEntityConstructor: {
        value: function (constructor) {

            if (!(constructor.prototype instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity constructor');
            }

            this.entityConstructor = constructor;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setIndexes: {
        value: function (indexes) {

            if (!(indexes instanceof Array)) {
                throw new TypeError('Invalid indexes definition');
            }

            this.indexes = indexes;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    persist: {
        value: function (entity) {

            if (!(entity instanceof this.entityConstructor)) {
                throw new TypeError('Entity not handled by the repository');
            }

            this.uow.handle(entity);
            this.cache.set(
                entity.get(this.entityKey),
                entity
            );

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (entity) {

            this.uow.remove(entity);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    flush: {
        value: function () {

            this.uow.commit();

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    findOneBy: {
        value: function (args) {

            if (args.index === this.entityKey) {
                if (this.cache.has(args.value)) {
                    setTimeout(
                        args.callback,
                        0,
                        this.cache.get(args.value)
                    );
                } else {
                    this.engine.read(
                        this.name,
                        args.value,
                        function (object) {
                            args.callback(
                                this.buildEntity(object)
                            );
                        }.bind(this)
                    );
                }
            } else {
                args.limit = 1;
                this.findBy(args);
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    findBy: {
        value: function (args) {

            this.engine.find(
                this.name,
                {
                    index: args.index,
                    value: args.value,
                    callback: function (results) {
                        this.findListener(args.callback, results);
                    }.bind(this),
                    limit: args.limit
                }
            );

            return this;

        }
    },

    /**
     * Intercept raw results and transform objects array into enitites one
     *
     * @private
     * @param {function} callback
     * @param {Array} results
     *
     * @return {void}
     */

    findListener: {
        value: function (callback, results) {

            var data = [];

            for (var i = 0, l = results.length; i < l; i++) {
                data.push(
                    this.buildEntity(results[i])
                );
            }

            callback(data);

        }
    },

    /**
     * Transform a raw object into an entity
     *
     * @private
     * @param {object} object
     *
     * @return {Sy.EntityInterface}
     */

    buildEntity: {
        value: function (object) {

            if (this.cache.has(object[this.entityKey])) {

                return this.cache.get(object[this.entityKey]);

            } else {

                var entity = new this.entityConstructor();

                entity.set(object);

                return entity;

            }

        }
    }

});
namespace('Sy.Storage');

/**
 * Factory that generates entities repository
 *
 * @package Sy
 * @subpackage Storage
 * @implements {Sy.FactoryInterface}
 * @class
 */

Sy.Storage.RepositoryFactory = function () {
    this.meta = null;
    this.loaded = null;
    this.uowFactory = null;
    this.registryFactory = null;
};

Sy.Storage.RepositoryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.Storage.RepositoryFactory}
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid registry factory');
            }

            this.meta = factory.make();
            this.loaded = factory.make();
            this.registryFactory = factory;

            return this;

        }
    },

    /**
     * Set the informations about repositories
     *
     * @param {Array} list
     *
     * @return {Sy.Storage.RepositoryFactory}
     */

    setMeta: {
        value: function (list) {

            for (var i = 0, l = list.length; i < l; i++) {
                this.meta.set(
                    list[i].name,
                    {
                        repository: list[i].repository,
                        entity: list[i].entity,
                        indexes: list[i].indexes,
                        uuid: list[i].uuid
                    }
                );
            }

            return this;

        }
    },

    /**
     * Set the UnitOfWork factory
     *
     * @param {Sy.Storage.UnitOfWorkFactory} factory
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setUOWFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.Storage.UnitOfWorkFactory)) {
                throw new TypeError('Invalid factory');
            }

            this.uowFactory = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (alias) {

            if (this.loaded.has(alias)) {
                return this.loaded.get(alias);
            }

            if (!this.meta.has(alias)) {
                throw new ReferenceError('Unknown repository "' + alias + '"');
            }

            var meta = this.meta.get(alias),
                repo = new meta.repository(),
                uow = this.uowFactory.make(alias, meta.uuid);

            if (!(repo instanceof Sy.Storage.RepositoryInterface)) {
                throw new TypeError('Invalid repository "' + alias + '"');
            }

            repo
                .setName(alias)
                .setEntityKey(meta.uuid)
                .setEntityConstructor(meta.entity)
                .setIndexes(meta.indexes)
                .setUnitOfWork(uow)
                .setCacheRegistry(this.registryFactory.make());

            this.loaded.set(alias, repo);

            return repo;

        }
    }

});
namespace('Sy.Storage.StoreMapper');

/**
 * IndexedDB store mapper
 *
 * @package Sy
 * @subpackage Storage.StoreMapper
 * @class
 * @implements {Sy.Storage.StoreMapperInterface}
 */

Sy.Storage.StoreMapper.IndexedDBMapper = function () {};
Sy.Storage.StoreMapper.IndexedDBMapper.prototype = Object.create(Sy.Storage.StoreMapperInterface.prototype, {

    /**
     * @inheritDoc
     */

    transform: {
        value: function (meta) {

            var store = {};

            store.alias = meta.name;
            store.name = meta.name.toLowerCase();
            store.identifier = meta.uuid;
            store.indexes = meta.indexes;

            return store;

        }
    }

});

namespace('Sy.Storage.StoreMapper');

/**
 * Localstorage store mapper
 *
 * @package Sy
 * @subpackage Storage.StoreMapper
 * @class
 * @implements {Sy.Storage.StoreMapperInterface}
 */

Sy.Storage.StoreMapper.LocalstorageMapper = function () {};
Sy.Storage.StoreMapper.LocalstorageMapper.prototype = Object.create(Sy.Storage.StoreMapperInterface.prototype, {

    /**
     * @inheritDoc
     */

    transform: {
        value: function (meta) {

            var store = {};

            store.alias = meta.name;
            store.name = meta.name.toLowerCase();
            store.identifier = meta.uuid;
            store.indexes = meta.indexes;

            return store;

        }
    }

});

namespace('Sy.Storage.StoreMapper');

/**
 * Rest store mapper
 *
 * @package Sy
 * @subpackage Storage.StoreMapper
 * @class
 * @implements {Sy.Storage.StoreMapperInterface}
 */

Sy.Storage.StoreMapper.RestMapper = function () {};
Sy.Storage.StoreMapper.RestMapper.prototype = Object.create(Sy.Storage.StoreMapperInterface.prototype, {

    /**
     * @inheritDoc
     */

    transform: {
        value: function (meta) {

            var store = {};

            store.alias = meta.name;
            store.name = meta.name.toLowerCase().replace('::', '/');
            store.identifier = meta.uuid;
            store.indexes = meta.indexes;

            return store;

        }
    }

});

namespace('Sy.Storage');

/**
 * Handles entity modifications done through repositories
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.UnitOfWork = function () {
    this.states = null;
    this.engine = null;
    this.generator = null;
    this.name = null;
    this.entityKey = null;
};
Sy.Storage.UnitOfWork.prototype = Object.create(Object.prototype, {

    SCHEDULED_FOR_CREATION: {
        value: 'create',
        writable: false
    },

    SCHEDULED_FOR_UPDATE: {
        value: 'update',
        writable: false
    },

    SCHEDULED_FOR_REMOVAL: {
        value: 'remove',
        writable: false
    },

    /**
     * Set a state registry to hold scheduled entities
     *
     * @param {Sy.StateRegistryInterface} states
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setStateRegistry: {
        value: function (states) {

            if (!(states instanceof Sy.StateRegistryInterface)) {
                throw new TypeError('Invalid state registry');
            }

            this.states = states;

            return this;

        }
    },

    /**
     * Set the engine it will use to apply modifications to
     *
     * @param {Sy.Storage.EngineInterface} engine
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.Storage.EngineInterface)) {
                throw new TypeError('Invalid engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * Set generator to build entities UUIDs
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setGenerator: {
        value: function (generator) {

            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;

        }
    },

    /**
     * Set the store name this uow depends on
     *
     * @param {String} name Store name
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    /**
     * Set the entity identifier key name
     *
     * @param {String} key
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    setEntityKey: {
        value: function (key) {

            this.entityKey = key;

            return this;

        }
    },

    /**
     * Create or update entities
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    handle: {
        value: function (entity) {

            if (!(entity instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity');
            }

            if (!entity.get(this.entityKey)) {
                entity.set(
                    this.entityKey,
                    this.generator.generate()
                );
                this.states.set(
                    this.SCHEDULED_FOR_CREATION,
                    entity.get(this.entityKey),
                    entity
                );
            } else if (this.isScheduledForCreation(entity)) {
                this.states.set(
                    this.SCHEDULED_FOR_CREATION,
                    entity.get(this.entityKey),
                    entity
                );
            } else {
                this.states.set(
                    this.SCHEDULED_FOR_UPDATE,
                    entity.get(this.entityKey),
                    entity
                );
            }

            return this;

        }
    },

    /**
     * Schedule an entity to be removed from storage
     * If the entity is scheduled to be created it prevents it
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    remove: {
        value: function (entity) {

            if (this.isScheduledForCreation(entity)) {
                this.states.remove(
                    this.SCHEDULED_FOR_CREATION,
                    entity.get(this.entityKey)
                );
            } else if (this.isScheduledForUpdate(entity)) {
                this.states.remove(
                    this.SCHEDULED_FOR_UPDATE,
                    entity.get(this.entityKey)
                );

                this.states.set(
                    this.SCHEDULED_FOR_REMOVAL,
                    entity.get(this.entityKey),
                    entity
                );
            } else {
                this.states.set(
                    this.SCHEDULED_FOR_REMOVAL,
                    entity.get(this.entityKey),
                    entity
                );
            }

        }
    },

    /**
     * Check if an entity is scheduled for the specific event
     *
     * @param {String} event
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledFor: {
        value: function (event, entity) {

            return this.states.has(
                event,
                entity.get(this.entityKey)
            );

        }
    },

    /**
     * Check if the entity is scheduled to be created
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForCreation: {
        value: function (entity) {

            return this.isScheduledFor(
                this.SCHEDULED_FOR_CREATION,
                entity
            );

        }
    },

    /**
     * Check if the entity is scheduled to be updated
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForUpdate: {
        value: function (entity) {

            return this.isScheduledFor(
                this.SCHEDULED_FOR_UPDATE,
                entity
            );

        }
    },

    /**
     * Check if the entity is sheduled to be removed
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForRemoval: {
        value: function (entity) {

            return this.isScheduledFor(
                this.SCHEDULED_FOR_REMOVAL,
                entity
            );

        }
    },

    /**
     * Flush modifications to the engine
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    commit: {
        value: function () {

            var toRemove = this.states.has(this.SCHEDULED_FOR_REMOVAL) ? this.states.get(this.SCHEDULED_FOR_REMOVAL) : [],
                toUpdate = this.states.has(this.SCHEDULED_FOR_UPDATE) ? this.states.get(this.SCHEDULED_FOR_UPDATE) : [],
                toCreate = this.states.has(this.SCHEDULED_FOR_CREATION) ? this.states.get(this.SCHEDULED_FOR_CREATION) : [];

            for (var i = 0, l = toRemove.length; i < l; i++) {
                this.engine.remove(
                    this.name,
                    toRemove[i].get(this.entityKey),
                    this.removalListener.bind(this)
                );
            }

            for (i = 0, l = toUpdate.length; i < l; i++) {
                this.engine.update(
                    this.name,
                    toUpdate[i].get(this.entityKey),
                    this.getEntityData(toUpdate[i]),
                    this.updateListener.bind(this)
                );
            }

            for (i = 0, l = toCreate.length; i < l; i++) {
                this.engine.create(
                    this.name,
                    this.getEntityData(toCreate[i]),
                    this.createListener.bind(this)
                );
            }

            return this;

        }
    },

    /**
     * Return the raw representation of the entity
     *
     * @private
     * @param {Sy.EntityInterface} entity
     *
     * @return {Object}
     */

    getEntityData: {
        value: function (entity) {

            var raw = {},
                keys = Object.keys(entity.attributes),
                refl = new ReflectionObject(entity),
                getter;

            for (var i = 0, l = keys.length; i < l; i++) {
                getter = 'get' + keys[i].substr(0, 1).toUpperCase() + keys[i].substr(1);
                if (refl.hasMethod(getter)) {
                    raw[keys[i]] = refl.getMethod(getter).call();
                } else {
                    raw[keys[i]] = entity.get(keys[i]);
                }

                if (raw[keys[i]] instanceof Sy.EntityInterface) {
                    raw[keys[i]] = raw[keys[i]].get(raw[keys[i]].UUID);
                }
            }

            return raw;

        }
    },

    /**
     * Engine removal listener callback
     *
     * @private
     * @param {String} identifier
     *
     * @return {void}
     */

    removalListener: {
        value: function (identifier) {

            this.states.remove('remove', identifier);

        }
    },

    /**
     * Engine update listener callback
     *
     * @private
     * @param {object} object
     *
     * @return {void}
     */

    updateListener: {
        value: function (object) {

            this.states.remove('update', object[this.entityKey]);

        }
    },

    /**
     * Engine create listener callback
     *
     * @private
     * @param {String} identifier
     *
     * @return {void}
     */

    createListener: {
        value: function (identifier) {

            this.states.remove('create', identifier);

        }
    }

});

namespace('Sy.Storage');

/**
 * Generates UnitOfWork objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.UnitOfWorkFactory = function () {
    this.generator = null;
    this.stateRegistryFactory = null;
};
Sy.Storage.UnitOfWorkFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the common generator for all unit of works
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWorkFactory}
     */

    setGenerator: {
        value: function (generator) {

            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;

        }
    },

    /**
     * Set the state registry factory
     *
     * @param {Sy.StateRegistry} factory
     *
     * @return {Sy.Storage.UnitOfWorkFactory}
     */

    setStateRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.StateRegistryFactory)) {
                throw new TypeError('Invalid state registry factory');
            }

            this.stateRegistryFactory = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, entityKey) {

            var uow = new Sy.Storage.UnitOfWork();

            uow
                .setStateRegistry(this.stateRegistryFactory.make())
                .setGenerator(this.generator)
                .setName(name)
                .setEntityKey(entityKey);

            return uow;

        }
    }

});

namespace('Sy.Validator');

/**
 * Interface to declare required constraint methods
 *
 * @package Sy
 * @subpackage Validator
 * @interface
 */

Sy.Validator.ConstraintInterface = function (options) {};
Sy.Validator.ConstraintInterface.prototype = Object.create(Object.prototype, {

    /**
     * Check if the given validation group is set for the constraint
     *
     * @param {String} group
     *
     * @return {Boolean}
     */

    hasGroup: {
        value: function (group) {}
    },

    /**
     * Return the path to the constraint validator class
     *
     * @return {String}
     */

    validateBy: {
        value: function () {}
    }

});

namespace('Sy.Validator');

/**
 * Interface that eachconstraint validator must implement
 *
 * @package Sy
 * @subpackage Validator
 * @interface
 */

Sy.Validator.ConstraintValidatorInterface = function () {};
Sy.Validator.ConstraintValidatorInterface.prototype = Object.create(Object.prototype, {

    /**
     * Inject the current validation context
     *
     * @param {Sy.Validator.ExecutionContextInterface} context
     *
     * @return {Sy.Validator.ConstraintValidatorInterface} self
     */

    setContext: {
        value: function (context) {}
    },

    /**
     * Validate a value
     *
     * @param {mixed} value
     * @param {Sy.Validator.ConstraintInterface} constraint
     */

    validate: {
        value: function (value, constraint) {}
    }

});

namespace('Sy.Validator');

/**
 * Main validator, it's the interface to the outer world
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.Core = function () {
    this.rules = null;
    this.contextFactory = null;
    this.constraintFactory = null;
    this.useReflection = true;
};
Sy.Validator.Core.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold defined rules
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Validator.Core} self
     */

    setRulesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.rules = registry;

            return this;
        }
    },

    /**
     * Set the context factory
     *
     * @param {Sy.Validator.ExecutionContextFactory} factory
     *
     * @return {Sy.Validator.Core} self
     */

    setContextFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ExecutionContextFactory)) {
                throw new TypeError('Invalid context factory');
            }

            this.contextFactory = factory;

            return this;
        }
    },

    /**
     * Set the constraint factory
     *
     * @param {Sy.Validator.ConstraintFactory} factory
     *
     * @return {Sy.Validator.Core} self
     */

    setConstraintFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ConstraintFactory)) {
                throw new TypeError('Invalid constraint factory');
            }

            this.constraintFactory = factory;

            return this;
        }
    },

    /**
     * Activate the use of reflection to get property
     * value out of an object when validating
     *
     * @return {Sy.Validator.Code} self
     */

    enableReflection: {
        value: function () {
            this.useReflection = true;

            return this;
        }
    },

    /**
     * Deactivate the use of reflection to get property
     * value out of an object when validating
     *
     * @return {Sy.Validator.Code} self
     */

    disableReflection: {
        value: function () {
            this.useReflection = false;

            return this;
        }
    },

    /**
     * Register new set of rules for objects
     *
     * @param {Object} data
     *
     * @return {Sy.Validator.Core} self
     */

    registerRules: {
        value: function (data) {

            for (var path in data) {
                if (data.hasOwnProperty(path)) {
                    this.registerRule(path, data[path]);
                }
            }

            return this;

        }
    },

    /**
     * Register rules for the specified class path
     *
     * @param {String} path Class path
     * @param {Object} data
     *
     * @return {Sy.Validator.Core} self
     */

    registerRule: {
        value: function (path, data) {
            if (this.rules.has(path)) {
                throw new ReferenceError('Rules are already defined for the path "' + path + '"');
            }

            if (data.getters === undefined) {
                data.getters = {};
            }

            if (data.properties === undefined) {
                data.properties = {};
            }

            this.rules.set(path, data);

            return this;
        }
    },

    /**
     * Validate a value against a (or a set of) constraint(s)
     *
     * @param {mixed} value
     * @param {mixed} constraints Must be a constraint or array of constraints
     * @param {String|Array} groups Optional, must be string or array of strings
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    validateValue: {
        value: function (value, constraints, groups) {

            groups = groups || [];

            if (!(constraints instanceof Array)) {
                constraints = [constraints];
            }

            if (!(groups instanceof Array)) {
                groups = [groups];
            }

            var context = this.contextFactory.make();

            for (var i = 0, l = constraints.length; i < l; i++) {
                context.validate(value, constraints[i], groups);
            }

            return context.getViolations();

        }
    },

    /**
     * Validate an object, it must have been declared first
     *
     * @param {Object} object
     * @param {String|Array} groups Optional
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    validate: {
        value: function (object, groups) {

            var rules = this.resolve(object),
                context = this.contextFactory.make(),
                constraint,
                value,
                refl,
                propGetter;

            groups = groups || [];

            if (!(groups instanceof Array)) {
                groups = [groups];
            }

            context.setObject(object);

            for (var getter in rules.getters) {
                if (rules.getters.hasOwnProperty(getter)) {
                    context.setPath(getter);

                    for (constraint in rules.getters[getter]){
                        if (rules.getters[getter].hasOwnProperty(constraint)) {
                            context.validate(
                                object[getter](),
                                this.constraintFactory.make(
                                    constraint,
                                    rules.getters[getter][constraint]
                                ),
                                groups
                            );
                        }
                    }
                }
            }

            for (var property in rules.properties) {
                if (rules.properties.hasOwnProperty(property)) {
                    context.setPath(property);

                    if (this.useReflection) {
                        refl = new ReflectionObject(object);
                        propGetter = 'get' + property.charAt(0).toUpperCase() + property.substr(1);

                        if (refl.hasMethod(propGetter)) {
                            value = refl.getMethod(propGetter).call()
                        } else if (refl.hasMethod('get')) {
                            value = refl.getMethod('get').call(property);
                        } else {
                            value = refl.getProperty(property).getValue();
                        }
                    } else {
                        value = object[property];
                    }

                    for (constraint in rules.properties[property]) {
                        if (rules.properties[property].hasOwnProperty(constraint)) {
                            context.validate(
                                value,
                                this.constraintFactory.make(
                                    constraint,
                                    rules.properties[property][constraint]
                                ),
                                groups
                            );
                        }
                    }
                }
            }

            return context.getViolations();

        }
    },

    /**
     * Look for the rules for the given object
     *
     * @private
     * @param {Object} object
     *
     * @return {Object} Set of rules
     */

    resolve: {
        value: function (object) {
            var mapping = this.rules.getMapping(),
                constructor;

            for (var path in mapping) {
                if (mapping.hasOwnProperty(path)) {
                    constructor = objectGetter(path);

                    if (!!constructor && object instanceof constructor) {
                        return mapping[path];
                    }
                }
            }

            throw new ReferenceError('No rules defined for the specified object');
        }
    }

});

namespace('Sy.Validator');

/**
 * Basic constraint that implement the `hasGroup` interface method
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.Validator.ConstraintInterface}
 */

Sy.Validator.AbstractConstraint = function (options) {
    Sy.Validator.ConstraintInterface.call(this, options);

    this.groups = options.groups instanceof Array ? options.groups : [];
};
Sy.Validator.AbstractConstraint.prototype = Object.create(Sy.Validator.ConstraintInterface.prototype, {

    /**
     * @inheritDoc
     */

    hasGroup: {
        value: function (group) {
            return this.groups instanceof Array && this.groups.indexOf(group) !== -1;
        }
    }

})

namespace('Sy.Validator');

/**
 * Abstract constraint validator that implements context setter
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.Validator.ConstraintValidatorInterface}
 */

Sy.Validator.AbstractConstraintValidator = function () {
    this.context = null;
};
Sy.Validator.AbstractConstraintValidator.prototype = Object.create(Sy.Validator.ConstraintValidatorInterface.prototype, {

    /**
     * @inheritDoc
     */

    setContext: {
        value: function (context) {
            this.context = context;

            return this;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Constraint to check if a value is an empty string or is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Blank = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value must be blank';
};
Sy.Validator.Constraint.Blank.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.BlankValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Blank constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.BlankValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.BlankValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Blank)) {
                throw new TypeError('Invalid constraint');
            }

            if (
                (typeof value === 'string' && value.length !== 0) &&
                value !== null
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Use a function to validate a value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Callback = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    if (options.callback === undefined) {
        throw new ReferenceError('Undefined constraint callback');
    }

    this.callback = options.callback;
};
Sy.Validator.Constraint.Callback.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.CallbackValidator';
        }
    },

    /**
     * Return the callback
     *
     * @return {String}
     */

    getCallback: {
        value: function () {
            return this.callback;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Callback constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.CallbackValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.CallbackValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Callback)) {
                throw new TypeError('Invalid constraint');
            }

            var callback = constraint.getCallback();

            this.context.getObject()[callback](this.context);

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is one of the defined choices
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Choice = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.choices = options.choices || [];
    this.multiple = !!options.multiple;
    this.min = parseInt(options.min, 10);
    this.max = parseInt(options.max, 10);
    this.message = options.message || 'The value you selected is not a valid choice';
    this.multipleMessage = options.multipleMessage || 'One or more of the given values is invalid';
    this.minMessage = options.minMessage || 'You must select more choices';
    this.maxMessage = options.maxMessage || 'You have selected too many choices';
    this.callback = options.callback;
};
Sy.Validator.Constraint.Choice.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.ChoiceValidator';
        }
    },

    /**
     * Return the choices array
     *
     * @return {Array}
     */

    getChoices: {
        value: function () {
            return this.choices;
        }
    },

    /**
     * Check if the constraint has a function defined to get choices
     *
     * @return {Boolean}
     */

    hasCallback: {
        value: function () {
            return !!this.callback;
        }
    },

    /**
     * Return the callback to get choices
     *
     * @return {String}
     */

    getCallback: {
        value: function () {
            return this.callback;
        }
    },

    /**
     * Check if the value can contain numerous choices
     *
     * @return {Boolean}
     */

    isMultiple: {
        value: function () {
            return this.multiple;
        }
    },

    /**
     * Check if the constraint has a minimum of choices
     *
     * @return {Boolean}
     */

    hasMin: {
        value: function () {
            return !isNaN(this.min);
        }
    },

    /**
     * Return the minimum count of choices required
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Check if the constraint has a maximum of choices
     *
     * @return {Boolean}
     */

    hasMax: {
        value: function () {
            return !isNaN(this.max);
        }
    },

    /**
     * Return the maximum count of choices required
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    },

    /**
     * Return the error message if multiple choices allowed
     *
     * @return {String}
     */

    getMultipleMessage: {
        value: function () {
            return this.multipleMessage;
        }
    },

    /**
     * Return the error message if too few choices
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the error message if too many choices
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Choice constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.ChoiceValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.ChoiceValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Choice)) {
                throw new TypeError('Invalid constraint');
            }

            if (constraint.isMultiple() && !(value instanceof Array)) {
                throw new TypeError('Array expected');
            }

            var choices;

            if (constraint.hasCallback()) {
                var callback = constraint.getCallback();

                choices = this.context.getObject()[callback]();
            } else {
                choices = constraint.getChoices();
            }

            if (constraint.isMultiple()) {
                for (var i = 0, l = value.length; i < l; i++) {
                    if (choices.indexOf(value[i]) === -1) {
                        this.context.addViolation(constraint.getMultipleMessage());
                    }
                }

                if (constraint.hasMin() && value.length < constraint.getMin()) {
                    this.context.addViolation(constraint.getMinMessage());
                }

                if (constraint.hasMax() && value.length > constraint.getMax()) {
                    this.context.addViolation(constraint.getMaxMessage());
                }
            } else if (choices.indexOf(value) === -1) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check a value is a country code
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Country = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value is not a valid country';
};
Sy.Validator.Constraint.Country.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.CountryValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

})

namespace('Sy.Validator.Constraint');

/**
 * Country constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.CountryValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.CountryValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Country)) {
                throw new TypeError('Invalid constraint');
            }

            if (Intl.Collator.supportedLocalesOf(value).length === 0) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is a valid date
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Date = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value is not a valid date';
};
Sy.Validator.Constraint.Date.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.DateValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Date constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.DateValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.DateValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Date)) {
                throw new TypeError('Invalid constraint');
            }

            if (typeof value === 'string') {
                if ((new Date(value)).toDateString() === 'Invalid Date') {
                    this.context.addViolation(constraint.getMessage());
                }
            } else if (!(value instanceof Date)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check the value is an email
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Email = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value is not a valid email';
};
Sy.Validator.Constraint.Email.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.EmailValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Email constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.EmailValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.EmailValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Email)) {
                throw new TypeError('Invalid constraint');
            }

            var regex = new RegExp(/^[a-z\.\-\_]+@[a-z\.\-\_]+\.[a-z]{2,}$/i);

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the validated value is equal to the given value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.EqualTo = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value should be equal to ' + options.value;
};
Sy.Validator.Constraint.EqualTo.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.EqualToValidator';
        }
    },

    /**
     * Return the wished value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * EqualTo constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.EqualToValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.EqualToValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.EqualTo)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is false
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.False = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be false';
};
Sy.Validator.Constraint.False.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.FalseValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * False constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.FalseValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.FalseValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.False)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== false) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is greater than the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.GreaterThan = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be greater than "' + options.value + '"';
};
Sy.Validator.Constraint.GreaterThan.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.GreaterThanValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * GreaterThan constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.GreaterThanValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.GreaterThanValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.GreaterThan)) {
                throw new TypeError('Invalid constraint');
            }

            if (value <= constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is greater than or equal to the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.GreaterThanOrEqual = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be greater than or equal to "' + options.value + '"';
};
Sy.Validator.Constraint.GreaterThanOrEqual.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.GreaterThanOrEqualValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * GreaterThanOrEqual constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.GreaterThanOrEqualValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.GreaterThanOrEqualValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.GreaterThanOrEqual)) {
                throw new TypeError('Invalid constraint');
            }

            if (value < constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is an IP address
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Ip = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.port = !!options.port;
    this.mask = !!options.mask;
    this.message = options.message || 'The value is not a valid IP address';
};
Sy.Validator.Constraint.Ip.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.IpValidator';
        }
    },

    /**
     * Does it must have a port specified
     *
     * @return {Boolean}
     */

    hasPort: {
        value: function () {
            return this.port;
        }
    },

    /**
     * Does it must have a wildcard mask
     *
     * @return {Boolean}
     */

    hasMask: {
        value: function () {
            return this.mask;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Ip constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.IpValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.IpValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Ip)) {
                throw new TypeError('Invalid constraint');
            }

            var portRegex = ':[0-9]{1,6}',
                maskRegex = '\\/(?:[12][0-9]|3[0-2]|[0-9])',
                regex = '^(?:[01]?[0-9]?[0-9]\.|2[0-4][0-9]\.|25[0-5]\.){3}(?:[01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]){1}';

            if (constraint.hasPort()) {
                regex += portRegex;
            }

            if (constraint.hasMask()) {
                regex += maskRegex;
            }

            regex = new RegExp(regex + '$');

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value has a length between the specified min and max
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Length = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.min = options.min;
    this.max = options.max;
    this.minMessage = options.minMessage || 'The value is too short';
    this.maxMessage = options.maxMessage || 'The value is too long';
    this.exactMessage = options.exactMessage || 'The value must be ' + this.min + ' long';
};
Sy.Validator.Constraint.Length.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.LengthValidator';
        }
    },

    /**
     * Get the minimum length
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Return the maximum length
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the error message if value too short
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the error message if value too long
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    },

    /**
     * Return the error message in case min is equal to max, and the value differs from it
     *
     * @return {String}
     */

    getExactMessage: {
        value: function () {
            return this.exactMessage;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Length constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LengthValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LengthValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Length)) {
                throw new TypeError('Invalid constraint');
            }

            if (value.length === undefined) {
                throw new TypeError('The value has no length attribute');
            }

            if (
                constraint.getMin() === constraint.getMax() &&
                value.length !== constraint.getMin()
            ) {
                this.context.addViolation(constraint.getExactMessage());
            } else {

                if (value.length < constraint.getMin()) {
                    this.context.addViolation(constraint.getMinMessage());
                }

                if (value.length > constraint.getMax()) {
                    this.context.addViolation(constraint.getMaxMessage());
                }

            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is less than the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.LessThan = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be less than "' + options.value + '"';
};
Sy.Validator.Constraint.LessThan.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.LessThanValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * LessThan constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LessThanValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LessThanValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.LessThan)) {
                throw new TypeError('Invalid constraint');
            }

            if (value >= constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is less than or equal to the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.LessThanOrEqual = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be less than or equal to "' + options.value + '"';
};
Sy.Validator.Constraint.LessThanOrEqual.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.LessThanOrEqualValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * LessThanOrEqual constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LessThanOrEqualValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LessThanOrEqualValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.LessThanOrEqual)) {
                throw new TypeError('Invalid constraint');
            }

            if (value > constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Constraint to check if a value is not an empty string nor is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotBlank = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value must not be blank';
};
Sy.Validator.Constraint.NotBlank.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotBlankValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotBlank constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotBlankValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotBlankValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotBlank)) {
                throw new TypeError('Invalid constraint');
            }

            if (
                (typeof value === 'string' && value.length === 0) ||
                value === null
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the validated value is equal to the given value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotEqualTo = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must not be equal to ' + options.value;
};
Sy.Validator.Constraint.NotEqualTo.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotEqualToValidator';
        }
    },

    /**
     * Return the wished value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotEqualTo constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotEqualToValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotEqualToValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotEqualTo)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is not null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotNull = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must not be null';
};
Sy.Validator.Constraint.NotNull.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotNullValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotNull constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotNullValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotNullValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotNull)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === null) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is not undefined
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotUndefined = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must not be undefined';
};
Sy.Validator.Constraint.NotUndefined.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotUndefinedValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotUndefined constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotUndefinedValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotUndefinedValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotUndefined)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === undefined) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Null = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be null';
};
Sy.Validator.Constraint.Null.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NullValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Null constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NullValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NullValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Null)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== null) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is in the defined range
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Range = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.min = options.min;
    this.max = options.max;
    this.minMessage = options.minMessage || 'The value is below the lower bound';
    this.maxMessage = options.maxMessage || 'The value is above the upper bound';
};
Sy.Validator.Constraint.Range.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.RangeValidator';
        }
    },

    /**
     * Return the lower bound
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Return the upper bound
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the lower bound error message
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the upper bound error message
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Range constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.RangeValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.RangeValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Range)) {
                throw new TypeError('Invalid constraint');
            }

            if (typeof value !== 'number' || isNaN(value)) {
                throw new TypeError('The value is not a numer');
            }

            if (value < constraint.getMin()) {
                this.context.addViolation(constraint.getMinMessage());
            }

            if (value > constraint.getMax()) {
                this.context.addViolation(constraint.getMaxMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value match the given pattern
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Regex = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.pattern = options.pattern;
    this.flags = options.flags;
    this.message = options.message || 'The value do not match the wished pattern';
};
Sy.Validator.Constraint.Regex.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.RegexValidator';
        }
    },

    /**
     * Return the regular expression pattern
     *
     * @return {String}
     */

    getPattern: {
        value: function () {
            return this.pattern;
        }
    },

    /**
     * Return the regular expression flags
     *
     * @return {String}
     */

    getFlags: {
        value: function () {
            return this.flags;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Regex constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.RegexValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.RegexValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Regex)) {
                throw new TypeError('Invalid constraint');
            }

            try {
                var regex = new RegExp(constraint.getPattern(), constraint.getFlags())

                if (!regex.test(value)) {
                    this.context.addViolation(constraint.getMessage());
                }
            } catch (e) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is true
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.True = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be true';
};
Sy.Validator.Constraint.True.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.TrueValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * True constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.TrueValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.TrueValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.True)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== true) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is of the specified type
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Type = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.type = options.type;
    this.message = options.message || 'The value differs from the specified type';
};
Sy.Validator.Constraint.Type.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.TypeValidator';
        }
    },

    /**
     * Return the wished type
     *
     * @return {mixed}
     */

    getType: {
        value: function () {
            return this.type;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Type constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.TypeValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.TypeValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Type)) {
                throw new TypeError('Invalid constraint');
            }

            var expected = constraint.getType(),
                constructor = objectGetter(expected) || function () {};

            if (
                typeof value !== expected &&
                !(value instanceof constructor)
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is undefined
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Undefined = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be undefined';
};
Sy.Validator.Constraint.Undefined.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.UndefinedValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Undefined constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.UndefinedValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.UndefinedValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Undefined)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== undefined) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is a valid url
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Url = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.protocols = options.protocols instanceof Array ? options.protocols : ['http', 'https'];
    this.message = options.message || 'The value is not a valid url';
};
Sy.Validator.Constraint.Url.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.UrlValidator';
        }
    },

    /**
     * Return the protocols
     *
     * @return {Array}
     */

    getProtocols: {
        value: function () {
            return this.protocols;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Url constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.UrlValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.UrlValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Url)) {
                throw new TypeError('Invalid constraint');
            }

            var protocols = constraint.getProtocols().join('|'),
                regex = new RegExp('^(' + protocols + ')://[a-z\-\_\.]+(?:\.[a-z]{2,})?.*$', 'i');

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator');

/**
 * Build an instance of the specified constraint
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ConstraintFactory = function () {};
Sy.Validator.ConstraintFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, options) {

            var constructor = Sy.Validator.Constraint[name],
                constraint;

            if (constructor === undefined) {
                throw new ReferenceError('The constraint "' + name + '" is undefined');
            }

            constraint = new constructor(options);

            if (!(constraint instanceof Sy.Validator.ConstraintInterface)) {
                throw new TypeError('"' + name + '" is not a valid constraint');
            }

            return constraint;

        }
    }

});

namespace('Sy.Validator');

/**
 * Build the validator object of a constraint
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ConstraintValidatorFactory = function () {
    this.validators = {};
};
Sy.Validator.ConstraintValidatorFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (constraint) {

            if (!(constraint instanceof Sy.Validator.ConstraintInterface)) {
                throw new TypeError('Invalid constraint');
            }

            var path = constraint.validatedBy(),
                constructor;

            if (this.validators[path] === undefined) {
                constructor = objectGetter(path);

                if (constructor === undefined) {
                    throw new ReferenceError('Undefined validator "' + path + '"');
                }

                this.validators[path] = new constructor();
            }

            return this.validators[path];

        }
    }

});
namespace('Sy.Validator');

/**
 * Holds message and path of a constraint violation
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ConstraintViolation = function (data) {
    this.message = data.message;
    this.path = data.path;
};
Sy.Validator.ConstraintViolation.prototype = Object.create(Object.prototype, {

    /**
     * Return the violation message
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.message;
        }
    },

    /**
     * Return the violation path
     *
     * @return {String}
     */

    getPath: {
        value: function () {
            return this.path;
        }
    },

    /**
     * Return raw object containing message + path
     *
     * @return {Object}
     */

    toJSON: {
        value: function () {
            return {
                message: this.message,
                path: this.path
            }
        }
    }

});

namespace('Sy.Validator');

/**
 * Holds a set of contraint violations messages
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ConstraintViolationList = function () {
    this.violations = [];
    this.length = 0;
};
Sy.Validator.ConstraintViolationList.prototype = Object.create(Object.prototype, {

    /**
     * Add a new violation
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    addViolation: {
        value: function (message) {
            this.violations.push(new Sy.Validator.ConstraintViolation({
                message: message
            }));
            this.length++;

            return this;
        }
    },

    /**
     * Add a new violation for the specified path
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    addViolationAt: {
        value: function (path, message) {
            this.violations.push(new Sy.Validator.ConstraintViolation({
                message: message,
                path: path
            }));
            this.length++;

            return this;
        }
    },

    /**
     * Apply a callback on each violations
     *
     * @param {Function} callback
     *
     * @return {Sy.Validator.ConstraintViolationList} self
     */

    forEach: {
        value: function (callback) {
            this.violations.forEach(callback);

            return this;
        }
    },

    /**
     * Return all the violations
     *
     * @return {Array}
     */

    getViolations: {
        value: function () {
            return this.violations;
        }
    },

    /**
     * Return the violations for the specified type
     *
     * @return {Array}
     */

    getViolationsAt: {
        value: function (path) {
            return this.violations.filter(function (violation) {
                return violation.getPath() === path;
            }.bind(this));
        }
    },

    /**
     * Return an array of raw representation of each violation
     *
     * @return {Array}
     */

    toJSON: {
        value: function () {
            return this.violations.map(function (element) {
                return element.toJSON();
            });
        }
    }

});

namespace('Sy.Validator');

/**
 * Execute the validation of values against constraints
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ExecutionContext = function () {
    this.constraintValidatorFactory = null;
    this.violations = null;
    this.path = null;
    this.object = null;
};
Sy.Validator.ExecutionContext.prototype = Object.create(Object.prototype, {

    /**
     * Set the constraint validator factory
     *
     * @param {Sy.Validator.ConstraintValidatorFactory} factory
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    setConstraintValidatorFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ConstraintValidatorFactory)) {
                throw new TypeError('Invalid constraint validator factory');
            }

            this.constraintValidatorFactory = factory;

            return this;
        }
    },

    /**
     * Set the constraint violations list
     *
     * @param {Sy.Validator.ConstraintViolationList} violations
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    setViolationList: {
        value: function (violations) {
            if (!(violations instanceof Sy.Validator.ConstraintViolationList)) {
                throw new TypeError('Invalid constraint violation list');
            }

            this.violations = violations;

            return this;
        }
    },

    /**
     * Return the violation list
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    getViolations: {
        value: function () {
            return this.violations;
        }
    },

    /**
     * Set the path in the object being validated
     *
     * @param {String} path
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    setPath: {
        value: function (path) {
            this.path = path;

            return this;
        }
    },

    /**
     * Set the object being validated
     *
     * @param {Object} object
     *
     * @return {Sy.Validator.ExecutionContext}
     */

    setObject: {
        value: function (object) {
            this.object = object;

            return this;
        }
    },

    /**
     * Return the object being validated
     *
     * @return {Object}
     */

    getObject: {
        value: function () {
            return this.object;
        }
    },

    /**
     * Add a new violation
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    addViolation: {
        value: function (message) {
            if (this.path) {
                this.violations.addViolationAt(this.path, message);
            } else {
                this.violations.addViolation(message);
            }
        }
    },

    /**
     * Add a new violation for the specified path
     *
     * @param {String} path
     * @param {String} message
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    addViolationAt: {
        value: function (path, message) {
            this.violations.addViolationAt(path, message);
        }
    },

    /**
     * Validate the value against the constraint
     *
     * @param {mixed} value
     * @param {Sy.Validator.ConstraintInterface} constraint
     * @param {Array} groups
     *
     * @return {void}
     */

    validate: {
        value: function (value, constraint, groups) {

            var validator = this.constraintValidatorFactory.make(constraint);

            if (groups instanceof Array && groups.length > 0) {
                for (var i = 0, l = groups.length; i < l; i++) {
                    if (constraint.hasGroup(groups[i])) {
                        validator
                            .setContext(this)
                            .validate(value, constraint);
                        break;
                    }
                }
            } else {
                validator
                    .setContext(this)
                    .validate(value, constraint);
            }

        }
    }

});

namespace('Sy.Validator');

/**
 * Generates new validation execution contexts
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ExecutionContextFactory = function () {
    this.constraintValidatorFactory = null;
};
Sy.Validator.ExecutionContextFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the constraint validator factory
     *
     * @param {Sy.Validator.ConstraintValidatorFactory} factory
     *
     * @return {Sy.Validator.ExecutionContextFactory} self
     */

    setConstraintValidatorFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ConstraintValidatorFactory)) {
                throw new TypeError('Invalid constraint validator factory');
            }

            this.constraintValidatorFactory = factory;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function () {
            var context = new Sy.Validator.ExecutionContext();

            return context
                .setConstraintValidatorFactory(this.constraintValidatorFactory)
                .setViolationList(new Sy.Validator.ConstraintViolationList());
        }
    }

});

namespace('Sy.Form');

/**
 * Representation of a form wrapper
 *
 * @package Sy
 * @subpackage Form
 * @interface
 */

Sy.Form.FormInterface = function () {};
Sy.Form.FormInterface.prototype = Object.create(Object.prototype, {

    /**
     * Add a new element to the form
     *
     * @param {String} name Name of the element in the dom, must be identical to the attribute of data class
     *
     * @return {Sy.Form.FormInterface} self
     */

    add: {
        value: function (name) {}
    },

    /**
     * Set the name of the form, will be used as the id
     * to look for form element in the dom
     *
     * @param {String} name
     *
     * @return {Sy.Form.FormInterface} self
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Return the form name
     *
     * @return {String}
     */

    getName: {
        value: function () {}
    },

    /**
     * Set the options config object
     *
     * @param {Sy.ConfiguratorInterface} config
     *
     * @return {Sy.Form.FormInterface} self
     */

    setOptions: {
        value: function (config) {}
    },

    /**
     * Check if the form data is valid by injecting data
     * to the object and then passing it to the validator
     *
     * If no validator set, it will use the html `checkValidity`
     *
     * @return {Boolean}
     */

    isValid: {
        value: function () {}
    },

    /**
     * Set the object that will hold form data
     *
     * @param {Object} object
     *
     * @return {Sy.Form.FormInterface}
     */

    setObject: {
        value: function (object) {}
    },

    /**
     * Return an instance of the data class
     *
     * @return {Object}
     */

    getObject: {
        value: function () {}
    },

    /**
     * Extract the data off of the form element
     * If no element specified it will check if
     * one has been defined previously
     *
     * @param {HTMLFormElement} form Optional
     *
     * @return {Sy.Form.FormInterface} self
     */

    handle: {
        value: function (form) {}
    },

    /**
     * Inject the validator
     *
     * @param {Sy.Validator.Core} validator
     *
     * @return {Sy.Form.FormInterface} self
     */

    setValidator: {
        value: function (validator) {}
    }

});

namespace('Sy.Form');

/**
 * Class use to build instances of classes implementing `Sy.Form.FormInterface`
 *
 * @package Sy
 * @subpackage Form
 * @interface
 */

Sy.Form.FormBuilderInterface = function () {};
Sy.Form.FormBuilderInterface.prototype = Object.create(Object.prototype, {

    /**
     * Add a new element to the form
     *
     * @param {String} name
     *
     * @return {Sy.Form.FormBuilderInterface} self
     */

    add: {
        value: function (name) {}
    },

    /**
     * Set the user defined options to the form
     *
     * @param {Sy.ConfiguratorInterface} config
     *
     * @return {Sy.Form.FormBuilderInterface} self
     */

    setOptions: {
        value: function (config) {}
    },

    /**
     * Set the form name
     *
     * @param {String} name
     *
     * @return {Sy.Form.FormBuilderInterface} self
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Set the object that will hold data to the form
     *
     * @param {Object} object
     *
     * @return {Sy.Form.FormBuilderInterface}
     */

    setObject: {
        value: function (object) {}
    },

    /**
     * Return the form
     *
     * @return {Sy.Form.FormInterface}
     */

    getForm: {
        value: function () {}
    }

});

namespace('Sy.Form');

/**
 * Representation of a form
 *
 * @package Sy
 * @subpackage Form
 * @interface
 */

Sy.Form.FormTypeInterface = function () {};
Sy.Form.FormTypeInterface.prototype = Object.create(Object.prototype, {

    /**
     * Pass the form builder to define the form elements
     *
     * @param {Sy.Form.FormBuilderInterface} builder
     * @param {Sy.ConfiguratorInterface} options
     *
     * @return {void}
     */

    buildForm: {
        value: function (builder, options) {}
    },

    /**
     * Set the default options for the form,
     * like the data class or the validation groups
     *
     * @param {Sy.ConfiguratorInterface} config
     */

    setDefaultOptions: {
        value: function (config) {}
    },

    /**
     * Set the form name
     *
     * @return {String}
     */

    getName: {
        value: function () {}
    }

});

namespace('Sy.Form');

/**
 * Default implementation of `FormInterface`
 *
 * @package Sy
 * @subpackage Form
 * @class
 * @implements {Sy.Form.FormInterface}
 */

Sy.Form.Form = function () {
    this.elements = [];
    this.name = null;
    this.config = null;
    this.validator = null;
    this.form = null;
    this.object = null;
};
Sy.Form.Form.prototype = Object.create(Sy.Form.FormInterface.prototype, {

    /**
     * @inheritDoc
     */

    add: {
        value: function (name) {
            this.elements.push(name);

            return this;
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

    setOptions: {
        value: function (config) {
            if (!(config instanceof Sy.ConfiguratorInterface)) {
                throw new TypeError('Invalid configurator');
            }

            this.config = config;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    isValid: {
        value: function () {

            if (this.validator) {
                return !!this.validator.validate(
                    this.object,
                    this.config.get('validationGroups')
                );
            } else if (this.form) {
                return this.form.checkValidity();
            }

            return true;

        }
    },

    /**
     * @inheritDoc
     */

    setObject: {
        value: function (object) {
            this.object = object;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getObject: {
        value: function () {
            return this.object;
        }
    },

    /**
     * @inheritDoc
     */

    handle: {
        value: function (form) {
            if (form) {
                this.form = form;
            } else if (!this.form && this.getName()) {
                this.form = document.querySelector('form[id=' + this.getName() + ']');
            }

            if (!this.form && !(this.form instanceof HTMLFormElement)) {
                throw new ReferenceError('Form element not found');
            }

            if (!this.object) {
                return;
            }

            var refl = new ReflectionObject(this.object),
                els = this.elements,
                setter,
                value;

            for (var i = 0, l = els.length; i < l; i++) {
                if (this.form.elements[els[i]] !== undefined) {
                    setter = 'set' + els[i].charAt(0).toUpperCase() + els[i].substr(1);
                    value = this.form.elements[els[i]].value;

                    if (refl.hasMethod(setter)) {
                        refl.getMethod(setter).call(value);
                    } else if (refl.hasMethod('set')) {
                        refl.getMethod('set').call(els[i], value);
                    } else {
                        this.object[els[i]] = value;
                    }
                }
            }

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setValidator: {
        value: function (validator) {
            if (!(validator instanceof Sy.Validator.Core)) {
                throw new TypeError('Invalid validator');
            }

            this.validator = validator;

            return this;
        }
    }

});

namespace('Sy.Form');

/**
 * Default implementation of `FormBuilderInterface`
 *
 * @package Sy
 * @subpackage Form
 * @class
 * @implements {Sy.Form.FormBuilderInterface}
 */

Sy.Form.FormBuilder = function () {
    this.form = new Sy.Form.Form();
};
Sy.Form.FormBuilder.prototype = Object.create(Sy.Form.FormBuilderInterface.prototype, {

    /**
     * @inheritDoc
     */

    add: {
        value: function (name) {
            this.form.add(name);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setOptions: {
        value: function (config) {
            this.form.setOptions(config);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {
            this.form.setName(name);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setObject: {
        value: function (object) {
            this.form.setObject(object);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getForm: {
        value: function () {
            return this.form;
        }
    },

    /**
     * Set the validator to the form
     *
     * @param {Sy.Validator.Core} validator
     *
     * @return {Sy.Form.FormBuilder}
     */

    setValidator: {
        value: function (validator) {
            this.form.setValidator(validator);

            return this;
        }
    }

});

namespace('Sy.Form');

/**
 * Entry point to build form instances for the developer
 *
 * @package Sy
 * @subpackage Form
 * @class
 */

Sy.Form.Builder = function () {
    this.validator = null;
    this.types = {};
};
Sy.Form.Builder.prototype = Object.create(Object.prototype, {

    /**
     * Set the validator
     *
     * @param {Sy.Validator.core} validator
     *
     * @return {Sy.Form.Builder} self
     */

    setValidator: {
        value: function (validator) {
            if (!(validator instanceof Sy.Validator.Core)) {
                throw new TypeError('Invalid validator');
            }

            this.validator = validator;

            return this;
        }
    },

    /**
     * Create a form builder based on the object passed
     *
     * @param {Object} data
     * @param {Object} options
     *
     * @return {Sy.Form.FormBuilderInterface}
     */

    createFormBuilder: {
        value: function (data, options) {
            var builder = new Sy.Form.FormBuilder(),
                config = new Sy.Configurator();

            if (options) {
                config.set(options);
            }

            builder
                .setOptions(config)
                .setObject(data);

            if (this.validator) {
                builder.setValidator(this.validator);
            }

            return builder;
        }
    },

    /**
     * Register a new form type
     *
     * @param {Sy.Form.FormTypeInterface} formType
     *
     * @return {Sy.Form.Builder} self
     */

    registerFormType: {
        value: function (formType) {
            if (!(formType instanceof Sy.Form.FormTypeInterface)) {
                throw new TypeError('Invalid form type');
            }

            this.types[formType.getName()] = formType;

            return this;
        }
    },

    /**
     * Create a form based on the form type
     *
     * @param {Sy.Form.FormTypeInterface|String} formType
     * @param {Object} object Optional, object that will hold form data
     * @param {Object} options
     *
     * @return {Sy.Form.FormInterface}
     */

    createForm: {
        value: function (formType, object, options) {
            if (typeof formType === 'string') {
                if (!this.types[formType]) {
                    throw new ReferenceError('Form type "' + formType + '" is undefined');
                }

                formType = this.types[formType];
            }

            var builder = new Sy.Form.FormBuilder(),
                config = new Sy.Configurator(),
                dataClass;

            builder.setName(formType.getName());
            formType.setDefaultOptions(config);

            if (options) {
                for (var prop in options) {
                    if (options.hasOwnProperty(prop)) {
                        config.set(prop, options[prop]);
                    }
                }
            }

            formType.buildForm(builder, config);

            builder.setOptions(config);

            if (!object && config.has('dataClass')) {
                dataClass = objectGetter(config.get('dataClass'));

                if (!dataClass) {
                    throw new ReferenceError('Data class "' + config.get('dataClass') + '" is undefined');
                }

                builder.setObject(new dataClass());
            } else if (object && typeof object === 'object') {
                if (
                    config.has('dataClass') &&
                    !(object instanceof objectGetter(config.get('dataClass')))
                ) {
                    throw new TypeError('The object is not an instance of "' + config.get('dataClass') + '"');
                }

                builder.setObject(object);
            }

            if (this.validator) {
                builder.setValidator(this.validator);
            }

            return builder.getForm();
        }
    }

});

namespace('Sy');

/**
 * Wrapper to set/retrieve key/value pairs
 *
 * @package Sy
 * @interface
 */

Sy.ConfiguratorInterface = function () {};

Sy.ConfiguratorInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a new key/value pair
     *
     * @param {string} key
     * @param {mixed} value
     *
     * @return {Sy.ConfiguratorInterface}
     */

    set: {
        value: function (key, value) {}
    },

    /**
     * Return a previously set value through its key
     *
     * @param {string} key
     *
     * @return {mixed}
     */

    get: {
        value: function (key) {}
    },

    /**
     * Check if a key is set in the configuration
     *
     * @param {string} key
     *
     * @return {boolean}
     */

    has: {
        value: function (key) {}
    },

    /**
     * Set a name for configuration object
     *
     * @param {string} name
     *
     * @return {Sy.ConfiguratorInterface}
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Return the configuration name
     *
     * @return {string}
     */

    getName: {
        value: function () {}
    }

});
namespace('Sy');

/**
 * Wrapper to set/retrieve key/value pairs
 *
 * @package Sy
 * @class
 * @implements {Sy.ConfiguratorInterface}
 */

Sy.Configurator = function () {

    this.name = '';
    this.config = {};

};

Sy.Configurator.prototype = Object.create(Sy.ConfiguratorInterface.prototype, {

    /**
     * @inheritDoc
     */

    set: {
        value: function (key, value) {

            if (key instanceof Object && value === undefined) {
                this.config = _.extend(this.config, key);
            } else {
                objectSetter.call(this.config, key, value);
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (key) {

            var value;

            if (key === undefined) {
                value = this.config;
            } else if (this.has(key)) {
                value = objectGetter.call(this.config, key);
            }

            return value;

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (key) {

            try {

                objectGetter.call(this.config, key);

                return true;

            } catch (error) {

                if (error instanceof ReferenceError) {
                    return false;
                }

            }

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
    },

    /**
     * @inheritDoc
     */

    getName: {
        value: function () {

            return this.name;

        }
    }

});
/**
 * Helper to abstract browsers diffs and extend dom manipulation
 *
 * @class
 */

DOM = function (node) {

    if (this === window) {
        return new DOM(node);
    }

    this.node = node;

};

DOM.prototype = Object.create(Object.prototype, {

    /**
     * Check if the node if a child of the specified node or css selector
     *
     * @param {string|HTMLElement} toMatch Parent node or css selector representing a parent
     * @param {HTMLElement} node Optional, default to instance node
     *
     * @return {Boolean}
     */

    isChildOf: {
        value: function (toMatch, node) {

            node = node || this.node;

            if (toMatch instanceof HTMLElement) {
                if (toMatch === node) {
                    return true;
                } else {
                    return this.isChildOf(toMatch, node.parentNode);
                }
            } else if (typeof toMatch === 'string') {
                if (this.matches(toMatch)) {
                    return true;
                } else {
                    return this.matches(toMatch, node.parentNode);
                }
            }

            return false;

        }
    },

    /**
     * Check if the node match a css selector
     *
     * @param {string} selector
     * @param {HTMLElement} node Optional, default to instance node
     *
     * @return {Boolean}
     */

    matches: {
        value: function (selector, node) {

            node = node || this.node;

            if (node.matches && node.matches(selector)) {
                return true;
            } else if (node.webkitMatchesSelector && node.webkitMatchesSelector(selector)) {
                return true;
            } else if (node.mozMatchesSelector && node.mozMatchesSelector(selector)) {
                return true;
            } else if (node.msMatchesSelector && node.msMatchesSelector(selector)) {
                return true;
            }

            return false;

        }
    }

});
namespace('Sy.View');

/**
 * Interface to list dependencies for this factory
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.LayoutFactoryInterface = function () {};
Sy.View.LayoutFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the dom parser
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setParser: {
        value: function (parser) {}
    },

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setTemplateEngine: {
        value: function (engine) {}
    },

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setRegistryFactory: {
        value: function (factory) {}
    },

    /**
     * Set the layout factory
     *
     * @param {Sy.View.LayoutFactoryInterface} factory
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setListFactory: {
        value: function (factory) {}
    }

});

namespace('Sy.View');

/**
 * Interface to list dependencies for this factory
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.ListFactoryInterface = function () {};
Sy.View.ListFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.ListFactoryInterface}
     */

    setTemplateEngine: {
        value: function (engine) {}
    }

});

namespace('Sy.View');

/**
 * Parse DOM nodes and replace placeholders by the given data
 *
 * @package Sy
 * @subpackage View
 * @interface
 */

Sy.View.TemplateEngineInterface = function () {};
Sy.View.TemplateEngineInterface.prototype = Object.create(Object.prototype, {

    /**
     * Placeholder pattern
     */

    PATTERN: {
        value: new RegExp(/{{\s?([\w.]+)\s?}}/igm),
        writable: false,
        configurable: false
    },

    /**
     * Parse DOM nodes and replace placeholders by the given data
     *
     * @param {HTMLElement} node
     * @param {Object} data
     *
     * @return {Sy.View.TemplateEngineInterface}
     */

    render: {
        value: function (node, data) {}
    }

});

namespace('Sy.View');

/**
 * Interface to list dependencies for this factory
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.ViewScreenFactoryInterface = function () {};
Sy.View.ViewScreenFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the dom parser
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setParser: {
        value: function (parser) {}
    },

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setTemplateEngine: {
        value: function (engine) {}
    },

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setRegistryFactory: {
        value: function (factory) {}
    },

    /**
     * Set the layout factory
     *
     * @param {Sy.View.LayoutFactoryInterface} factory
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setLayoutFactory: {
        value: function (factory) {}
    },

    /**
     * Set viewscreen wrapper constructor
     *
     * @param {String} name Viewscreen name it's attached to
     * @param {Function} viewscreenConstructor
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setViewScreenWrapper: {
        value: function (name, viewscreenConstructor) {}
    }

});

namespace('Sy.View.Event');

/**
 * Event fired before and after a viewscreen is displayed in the viewport
 *
 * @package Sy
 * @subpackage View.Event
 * @class
 */

Sy.View.Event.ViewPortEvent = function (viewscreen) {
	if (!(viewscreen instanceof Sy.View.ViewScreen)) {
		throw new TypeError('Invalid viewscreen');
	}

	this.viewscreen = viewscreen;
};
Sy.View.Event.ViewPortEvent.prototype = Object.create(Object.prototype, {

	PRE_DISPLAY: {
		value: 'view::on::pre::display',
		writable: false
	},

	POST_DISPLAY: {
		value: 'view::on::post::display',
		writable: false
	},

	/**
	 * Return the viewscreen being displayed
	 *
	 * @return {Sy.View.ViewScreen}
	 */

	getViewScreen: {
		value: function () {
			return this.viewscreen;
		}
	}

});

namespace('Sy.View');

/**
 * Abstract class to centralise getter/setter for node element + template engine setter
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.NodeWrapper = function () {
    this.engine = null;
    this.node = null;
};
Sy.View.NodeWrapper.prototype = Object.create(Object.prototype, {

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.NodeWrapper}
     */

    setTemplateEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.View.TemplateEngineInterface)) {
                throw new TypeError('Invalid template engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * Set the dom node
     *
     * @param {HTMLElement} node
     *
     * @return {Sy.View.NodeWrapper}
     */

    setNode: {
        value: function (node) {

            if (!(node instanceof HTMLElement)) {
                throw new TypeError('Invalid dom node');
            }

            this.node = node;

            return this;

        }
    },

    /**
     * Return the dom node
     *
     * @return {HTMLElement}
     */

    getNode: {
        value: function () {
            return this.node;
        }
    },

    /**
     * Render the node with the specified data
     *
     * @param {Object} data
     *
     * @return {Sy.View.NodeWrapper}
     */

    render: {
        value: function (data) {

            this.engine.render(this.node, data);

            return this;

        }
    },

    /**
     * Find one element in the node tree matching the given selector
     *
     * @param {String} selector Css selector
     *
     * @return {HTMLElement|null}
     */

    findOne: {
        value: function (selector) {
            return this.node.querySelector(selector);
        }
    },

    /**
     * Find a set of elements in the node tree matching the given selector
     *
     * @param {String} selector Css selector
     *
     * @return {NodeList}
     */

    find: {
        value: function (selector) {
            return this.node.querySelectorAll(selector);
        }
    }

});

namespace('Sy.View');

/**
 * Node wrapper to a view layout dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.NodeWrapper}
 */

Sy.View.Layout = function () {
    Sy.View.NodeWrapper.call(this);
    this.name = null;
    this.lists = null;
    this.parser = null;
    this.listFactory = null;
};
Sy.View.Layout.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * @inheritDoc
     */

    setNode: {
        value: function (node) {

            var lists,
                wrapper;

            Sy.View.NodeWrapper.prototype.setNode.call(this, node);

            this.name = node.dataset.syLayout;
            lists = this.parser.getLists(node);

            for (var i = 0, l = lists.length; i < l; i++) {
                wrapper = this.listFactory.make(lists[i]);

                this.lists.set(
                    wrapper.getName(),
                    wrapper
                );
            }

            return this;

        }
    },

    /**
     * Return the layout name
     *
     * @return {String}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Set the dom parser to look for list elements
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.Layout}
     */

    setParser: {
        value: function (parser) {

            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;

            return this;

        }
    },

    /**
     * Set the registry to hold the lists
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.Layout}
     */

    setListsRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.lists = registry;

            return this;

        }
    },

    /**
     * Set the factory to build lists wrappers
     *
     * @param {Sy.View.ListFactoryInterface} factory
     *
     * @return {Sy.View.Layout}
     */

    setListFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.ListFactoryInterface)) {
                throw new TypeError('Invalid list factory');
            }

            this.listFactory = factory;

            return this;

        }
    },

    /**
     * Return the lists array
     *
     * @return {Array}
     */

    getLists: {
        value: function () {
            return this.lists.get();
        }
    },

    /**
     * Return the specified list wrapper
     *
     * @param {String} name
     *
     * @return {Sy.View.List}
     */

    getList: {
        value: function (name) {
            return this.lists.get(name);
        }
    }

});
namespace('Sy.View');

/**
 * Default implementation of LayoutFactoryInterface
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.LayoutFactoryInterface}
 */

Sy.View.LayoutFactory = function () {
    this.parser = null;
    this.engine = null;
    this.registryFactory = null;
    this.listFactory = null;
};
Sy.View.LayoutFactory.prototype = Object.create(Sy.View.LayoutFactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    setParser: {
        value: function (parser) {

            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setTemplateEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.View.TemplateEngineInterface)) {
                throw new TypeError('Invalid template engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid registry factory');
            }

            this.registryFactory = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setListFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.ListFactoryInterface)) {
                throw new TypeError('Invalid list factory');
            }

            this.listFactory = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (node) {

            var wrapper = new Sy.View.Layout();

            return wrapper
                .setParser(this.parser)
                .setListFactory(this.listFactory)
                .setListsRegistry(this.registryFactory.make())
                .setTemplateEngine(this.engine)
                .setNode(node);

        }
    }

});

namespace('Sy.View');

/**
 * Node wrapper to a view list dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.NodeWrapper}
 */

Sy.View.List = function () {
    Sy.View.NodeWrapper.call(this);
    this.name = null;
    this.elements = [];
    this.types = [];
};
Sy.View.List.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * @inheritDoc
     */

    setNode: {
        value: function (node) {

            var child;

            Sy.View.NodeWrapper.prototype.setNode.call(this, node);

            this.name = node.dataset.syList;

            for (var i = 0, l = node.childElementCount; i < l; i++) {
                child = node.firstElementChild;
                this.elements.push(child);
                node.removeChild(child);

                if (this.elements.length > 1 && child.dataset.type === undefined) {
                    throw new SyntaxError('Multiple list elements require a type to be set');
                }

                if (child.dataset.type !== undefined) {
                    if (this.types.indexOf(child.dataset.type) !== -1) {
                        throw new SyntaxError('Multiple list elements defined with the same type');
                    }

                    this.types.push(child.dataset.type);
                }
            }

            return this;

        }
    },

    /**
     * Return the layout name
     *
     * @return {String}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Render a specific element
     *
     * @private
     * @param {Object} data
     * @param {String} type
     *
     * @return {HTMLElement}
     */

    renderElement: {
        value: function (data, type) {

            var idx = type ? this.types.indexOf(type) : 0,
                node;

            if (idx === -1) {
                throw new ReferenceError('The type "' + type + '" does not exist for the list "' + this.getName() + '"');
            }

            node = this.elements[idx].cloneNode(true);

            return this.engine.render(node, data);

        }
    },

    /**
     * Append a new element rendered with the specified data to the list
     *
     * @param {Object} data
     * @param {String} type Element type (optional)
     *
     * @return {Sy.View.List}
     */

    append: {
        value: function (data, type) {

            this.getNode().appendChild(
                this.renderElement(data, type)
            );

            return this;

        }
    },

    /**
     * Prepend a new element rendered with the specified data to the list
     *
     * @param {Object} data
     * @param {String} type Element type (optional)
     *
     * @return {Sy.View.List}
     */

    prepend: {
        value: function (data, type) {

            this.getNode().insertBefore(
                this.renderElement(data, type),
                this.getNode().firstElementChild
            );

            return this;

        }
    },

    /**
     * Render the list will all the specified data (remove all elements from the list first)
     *
     * @param {Array} data Array of objects (Specify `_type` attribute to reference the type of element to be rendered on each object)
     *
     * @return {Sy.View.List}
     */

    render: {
        value: function (data) {

            var node = this.getNode(),
                d,
                type;

            while (node.firstElementChild) {
                node.removeChild(node.firstElementChild);
            }

            for (var j = 0, jl = data.length; j < jl; j++) {
                d = data[j];
                type = d._type;

                this.append(d, type);
            }

            return this;

        }
    }

});
namespace('Sy.View');

/**
 * Default implementation of ListFactoryInterface
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.ListFactory = function () {
    this.engine = null;
};
Sy.View.ListFactory.prototype = Object.create(Sy.View.ListFactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    setTemplateEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.View.TemplateEngineInterface)) {
                throw new TypeError('Invalid template engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (node) {

            var wrapper = new Sy.View.List();

            return wrapper
                .setTemplateEngine(this.engine)
                .setNode(node);

        }
    }

});

namespace('Sy.View');

/**
 * Handles the app views collection
 *
 * @package Sy
 * @subpackage View
 * @class
 */
Sy.View.Manager = function () {
    this.views = null;
    this.factory = null;
};
Sy.View.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry object
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.Manager}
     */

    setViewsRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.views = registry;

            return this;

        }
    },

    /**
     * Set the view screen wrapper factory
     *
     * @param {Sy.View.ViewScreenFactoryInterface} factory
     *
     * @return {Sy.View.Manager}
     */

    setViewScreenFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.ViewScreenFactoryInterface)) {
                throw new TypeError('Invalid factory');
            }

            this.factory = factory;

            return this;

        }
    },

    /**
     * Set a new view screen node
     *
     * @param {HTMLElement} node
     *
     * @return {Sy.View.Manager}
     */

    setViewScreen: {
        value: function (node) {

            if (!(node instanceof HTMLElement)) {
                throw new TypeError('Html node expected');
            }

            var name = node.dataset.syView;

            if (!name && name.trim() === '') {
                throw new SyntaxError('Attribute "data-sy-view" is expected');
            }

            if (this.views.has(name.trim())) {
                throw new ReferenceError('A view with the name "' + name.trim() + '"');
            }

            this.views.set(
                name.trim(),
                this.factory.make(node)
            );

            return this;

        }
    },

    /**
     * Return the node wrapper for the specified view screen name
     *
     * @param {string} name
     *
     * @return {Sy.View.ViewScreenInterface}
     */

    getViewScreen: {
        value: function (name) {

            if (!this.views.has(name)) {
                throw new ReferenceError('The view screen "' + name + '" is not registered');
            }

            return this.views.get(name);

        }
    },

    /**
     * Return an array of all registered viewscreens
     *
     * @return {Array}
     */

    getViewScreens: {
        value: function () {
            return this.views.get();
        }
    }

});

namespace('Sy.View');

/**
 * DOM parser to look for viewscreen/layout/list inside a dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.Parser = function () {};
Sy.View.Parser.prototype = Object.create(Object.prototype, {

    /**
     * Return the elements matching the specified selector inside the dom node
     *
     * @param {String} selector Css selector
     * @param {HTMLElement} node Optional (default to document.body)
     *
     * @return {NodeList}
     */

    get: {
        value: function (selector, node) {

            node = node || document.body;

            return node.querySelectorAll(selector);
        }
    },

    /**
     * Return the list of viewscreen elements
     *
     * @param {HTMLElement} node Root node (optional)
     *
     * @return {NodeList}
     */

    getViewScreens: {
        value: function (node) {
            return this.get('[data-sy-view]', node);
        }
    },

    /**
     * Return the list of layout elements
     *
     * @param {HTMLElement} node Root node (optional)
     *
     * @return {NodeList}
     */

    getLayouts: {
        value: function (node) {
            return this.get('[data-sy-layout]', node);
        }
    },

    /**
     * Return the list of list elements
     *
     * @param {HTMLElement} node Root node (optional)
     *
     * @return {NodeList}
     */

    getLists: {
        value: function (node) {
            return this.get('[data-sy-list]', node);
        }
    }

});
namespace('Sy.View');

/**
 * Default implementation of TemplateEngineInterface
 *
 * @package Sy
 * @subpackage View
 * @class
 * @implements {Sy.View.TemplateEngineInterface}
 */

Sy.View.TemplateEngine = function () {
    Sy.View.TemplateEngineInterface.call(this);
    this.registry = null;
    this.generator = null;
};
Sy.View.TemplateEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype, {

    /**
     * Set registry to hold rendered nodes references
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.TemplateEngine}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.registry = registry;

            return this;

        }
    },

    /**
     * Set a generator to identify each rendered node
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.View.TemplateEngine}
     */

    setGenerator: {
        value: function (generator) {

            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    render: {
        value: function (node, data) {

            if (!node.dataset.syUuid) {
                this.register(node);
            }

            if (node.dataset.syUuid && this.registry.has(node.dataset.syUuid)) {
                this.renderAllAttributes(node, data);
                this.renderContent(node, data);
            }

            if (node.childElementCount > 0) {
                for (var i = 0, l = node.childElementCount; i < l; i++) {
                    this.render(node.children[i], data);
                }
            }

            return node;

        }
    },

    /**
     * Set a UUID on the node and set in the registry all the default attributes and text content
     *
     * @private
     * @param {HTMLElement} node
     *
     * @return {Sy.View.TemplateEngine}
     */

    register: {
        value: function (node) {

            var uuid = this.generator.generate(),
                content = {
                    attributes: {},
                    textContent: null,
                    uuid: uuid
                };

            for (var i = 0, l = node.attributes.length; i < l; i++) {
                content.attributes[node.attributes[i].name] = node.getAttribute(node.attributes[i].name);
            }

            content.textContent = node.textContent;
            node.dataset.syUuid = uuid;
            this.registry.set(uuid, content);

            return this;

        }
    },

    /**
     * Loop an all node attributes and render them
     *
     * @private
     * @param {HTMLElement} node
     * @param {Object} data
     *
     * @return {HTMLElement}
     */

    renderAllAttributes: {
        value: function (node, data) {

            for (var i = 0, l = node.attributes.length; i < l; i++) {
                this.renderAttribute(node, node.attributes[i].name, data);
            }

            return node;

        }
    },

    /**
     * Render a specific attribute on a node
     *
     * @private
     * @param {HTMLElement} node
     * @param {String} attribute
     * @param {Object} data
     *
     * @return {HTMLElement}
     */

    renderAttribute: {
        value: function (node, attribute, data) {

            var uuid = node.dataset.syUuid,
                originalContent = this.registry.get(uuid).attributes[attribute],
                text;

            if (!originalContent) {
                return node;
            }

            text = this.replace(originalContent, data);
            node.setAttribute(attribute, text);

            return node;

        }
    },

    /**
     * Replace {{ \w }} with the approriate data
     *
     * @private
     * @param {string} source
     * @param {Object} data
     *
     * @return {string}
     */

    replace: {
        value: function (source, data) {

            while (source.match(this.PATTERN)) {
                var results = this.PATTERN.exec(source);

                if (results !== null && results.length >= 1) {
                    source = source.replace(results[0], reflectedObjectGetter.call(data, results[1]) || '');
                }
            }

            return source;

        }
    },

    /**
     * Replace textContent placeholders by data
     *
     * @private
     * @param {HTMLElement} node
     * @param {Object} data
     *
     * @return {void}
     */

    renderContent: {
        value: function (node, data) {

            if (node.childElementCount > 0) {
                return node;
            }

            var uuid = node.dataset.syUuid,
                originalContent = this.registry.get(uuid).textContent,
                results = this.PATTERN.exec(originalContent),
                d;

            if (results) {
                d = objectGetter.call(data, results[1]);
            }

            if (d instanceof HTMLElement) {
                node.removeChild(node.firstElementChild);
                node.appendChild(d);
            } else {
                node.textContent = this.replace(originalContent, data);
            }

            return node;

        }
    }

});

namespace('Sy.View');

/**
 * Top class to access the view mechanism and handle the app viewport
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.ViewPort = function () {
    this.node = null;
    this.manager = null;
    this.mediator = null;
    this.current = null;
};
Sy.View.ViewPort.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * Set the mediator to dispatch event when viewscreen is changed
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.View.ViewPort}
     */

    setMediator: {
        value: function (mediator) {

            if (!(mediator instanceof Sy.Lib.Mediator)) {
                throw new TypeError('Invalid mediator');
            }

            this.mediator = mediator;

            return this;

        }
    },

    /**
     * Set the view port node
     *
     * @param {HTMLElement} node
     *
     * @return {Sy.View.ViewPort}
     */

    setNode: {
        value: function (node) {

            if (!(node instanceof HTMLElement) || !node.classList.contains('viewport')) {
                throw new TypeError('Invalid node');
            }

            this.node = node;

            return this;

        }
    },

    /**
     * Set the view manager
     *
     * @param {Sy.View.Manager} manager
     *
     * @return {Sy.View.ViewPort}
     */

    setViewManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.View.Manager)) {
                throw new TypeError('Invalid manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * Return the view manager
     *
     * @return {Sy.View.Manager}
     */

    getViewManager: {
        value: function () {
            return this.manager;
        }
    },

    /**
     * Return the current viewscreen being displayed
     *
     * @return {Sy.View.ViewScreen}
     */

    getCurrentViewScreen: {
        value: function () {

            if (this.current === null && this.node.childElementCount === 1) {
                this.current = this.manager.getViewScreen(
                    this.node.firstElementChild.dataset.syView
                );
            }

            return this.current;

        }
    },

    /**
     * Set the specified view screen name as the current one in the view port
     *
     * @param {string} name ViewScreen name
     *
     * @return {Sy.View.ViewPort}
     */

    display: {
        value: function (name) {

            var viewscreen = this.manager.getViewScreen(name),
                node = viewscreen.getNode(),
                event = new Sy.View.Event.ViewPortEvent(viewscreen);

            if (this.mediator) {
                this.mediator.publish(event.PRE_DISPLAY, event);
            }

            switch (this.node.childElementCount) {
                case 0:
                    this.node.appendChild(node);
                    break;
                case 1:
                    this.node.replaceChild(node, this.node.children[0]);
                    break;
                default:
                    throw new Error('Viewport in weird state (more than 1 child)');
            }

            this.current = viewscreen;

            if (this.mediator) {
                this.mediator.publish(event.POST_DISPLAY, event);
            }

            return this;

        }
    }

});

namespace('Sy.View');

/**
 * Wrapper for a view screen dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.NodeWrapper}
 */

Sy.View.ViewScreen = function () {
    Sy.View.NodeWrapper.call(this);
    this.name = '';
    this.parser = null;
    this.layouts = null;
    this.layoutFactory = null;
};
Sy.View.ViewScreen.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * @inheritDoc
     */

    setNode: {
        value: function (node) {

            var layouts,
                wrapper;

            Sy.View.NodeWrapper.prototype.setNode.call(this, node);

            this.name = node.dataset.syView;
            layouts = this.parser.getLayouts(node);

            for (var i = 0, l = layouts.length; i < l; i++) {
                wrapper = this.layoutFactory.make(layouts[i]);

                this.layouts.set(
                    wrapper.getName(),
                    wrapper
                );
            }

            return this;

        }
    },

    /**
     * Return the view screen name
     *
     * @return {string}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Set the dom parser to look for layouts elements
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.ViewScreen}
     */

    setParser: {
        value: function (parser) {

            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;

            return this;

        }
    },

    /**
     * Set the registry to hold the layouts
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.ViewScreen}
     */

    setLayoutsRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.layouts = registry;

            return this;

        }
    },

    /**
     * Set the factory to build layouts wrappers
     *
     * @param {Sy.View.LayoutFactoryInterface} factory
     *
     * @return {Sy.View.ViewScreen}
     */

    setLayoutFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.LayoutFactoryInterface)) {
                throw new TypeError('Invalid layout factory');
            }

            this.layoutFactory = factory;

            return this;

        }
    },

    /**
     * Return the layouts array
     *
     * @return {Array}
     */

    getLayouts: {
        value: function () {
            return this.layouts.get();
        }
    },

    /**
     * Return the specified layout wrapper
     *
     * @param {String} name
     *
     * @return {Sy.View.Layout}
     */

    getLayout: {
        value: function (name) {
            return this.layouts.get(name);
        }
    }

});

namespace('Sy.View');

/**
 * Default implementation of ViewScreenFactoryInterface
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.ViewScreenFactoryInterface}
 */

Sy.View.ViewScreenFactory = function () {
    this.parser = null;
    this.engine = null;
    this.registryFactory = null;
    this.layoutFactory = null;
    this.viewscreens = null;
};
Sy.View.ViewScreenFactory.prototype = Object.create(Sy.View.ViewScreenFactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    setParser: {
        value: function (parser) {

            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setTemplateEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.View.TemplateEngineInterface)) {
                throw new TypeError('Invalid template engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid registry factory');
            }

            this.registryFactory = factory;
            this.viewscreens = factory.make();

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setLayoutFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.LayoutFactoryInterface)) {
                throw new TypeError('Invalid layout factory');
            }

            this.layoutFactory = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setViewScreenWrapper: {
        value: function (name, viewscreenConstructor) {

            if (this.viewscreens.has(name)) {
                throw new ReferenceError('A viewscreen wrapper is already defined with the name "' + name + '"');
            }

            this.viewscreens.set(name, viewscreenConstructor);

            return this;

        }
    },

    /**
     * Pass the array of wrappers found in the project
     *
     * @param {Array} wrappers
     *
     * @return {Sy.View.ViewScreenFactory}
     */

    setDefinedWrappers: {
        value: function (wrappers) {

            for (var i = 0, l = wrappers.length; i < l; i++) {
                this.setViewScreenWrapper(
                    wrappers[i].name,
                    wrappers[i].creator
                );
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (node) {

            var name = node.dataset.syView,
                wrapper;

            if (this.viewscreens.has(name)) {
                wrapper = new (this.viewscreens.get(name))();
            } else {
                wrapper = new Sy.View.ViewScreen();
            }

            if (!(wrapper instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen wrapper');
            }

            return wrapper
                .setParser(this.parser)
                .setLayoutFactory(this.layoutFactory)
                .setLayoutsRegistry(this.registryFactory.make())
                .setTemplateEngine(this.engine)
                .setNode(node);

        }
    }

});

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
namespace('Sy');

/**
 * Class allowing to store translations string
 *
 * @package Sy
 * @class
 */

Sy.Translator = function () {
    this.currentLanguage = null;
    this.languages = null;
    this.stateRegistryFactory = null;
};

Sy.Translator.prototype = Object.create(Object.prototype, {

    /**
     * Set the language registry
     *
     * @param {Sy.Registry} registry
     *
     * @return {Sy.Translator}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.Registry)) {
                throw new TypeError('Invalid registry');
            }

            this.languages = registry;

            return this;

        }
    },

    /**
     * Set the state registry factory used to easily create new groups of translations
     *
     * @param {Sy.StateRegistryFactory} factory
     *
     * @return {Sy.Translator}
     */

    setStateRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.StateRegistryFactory)) {
                throw new TypeError('Invalid state registry factory');
            }

            this.stateRegistryFactory = factory;

            return this;

        }
    },

    /**
     * Set the language to translate to
     *
     * @param {string} language
     *
     * @return {Sy.Translator}
     */

    setLanguage: {
        value: function (language) {

            this.currentLanguage = language;
            return this;

        }
    },

    /**
     * Register new translations data
     *
     * @param {string} language
     * @param {string} domain Group of translations
     * @param {string} key Translation key
     * @param {string} translation Translated string
     *
     * @return {Sy.Translator}
     */

    registerTranslation: {
        value: function (language, domain, key, translation) {

            if (!this.languages.has(language)) {
                this.languages.set(
                    language,
                    this.stateRegistryFactory.make()
                );
            }

            this.languages.get(language).set(
                domain,
                key,
                translation
            );

            return this;

        }
    },

    /**
     * Register multiple translations at once
     *
     * The translations array is composed of objects like below:
     * <code>
     * {
     *     'domain': 'domain of the translation', //optional (default to root)
     *     'key': 'key to access translation',
     *     'translation': 'translated string'
     * }
     * </code>
     *
     * @param {string} language
     * @param {Array} translations
     *
     * @return {Sy.Translator}
     */

    registerTranslations: {
        value: function (language, translations) {

            for (var i = 0, l = translations.length; i < l; i++) {
                this.registerTranslation(
                    language,
                    translations[i].domain || 'root',
                    translations[i].key,
                    translations[i].translation
                );
            }

            return this;

        }
    },

    /**
     * Translate a string
     *
     * @param {string} key
     * @param {string} domain Optional (default to root)
     * @param {string} language Enforce the translation language, optional
     *
     * @return {string}
     */

    translate: {
        value: function (key, domain, language) {

            var lang = language || this.currentLanguage;
            domain = domain || 'root';

            if (
                !this.languages.has(lang) ||
                !this.languages.get(lang).has(domain, key)
            ) {
                return key;
            }

            return this.languages.get(lang).get(domain, key);

        }
    }

});
namespace('Sy');

Sy.kernel = new Sy.Kernel.Core();
Sy.kernel.getConfig().set({
    env: 'prod',
    parameters: {
        app: {
            meta: {
                viewscreens: [] //array of objects containing `name` and `creator` attributes
            }
        },
        storage: {
            engines: [
                {
                    name: 'indexeddb',
                    factory: 'sy::core::storage::factory::engine::indexeddb',
                    mapper: 'sy::core::storage::storemapper::indexeddb'
                },
                {
                    name: 'localstorage',
                    factory: 'sy::core::storage::factory::engine::localstorage',
                    mapper: 'sy::core::storage::storemapper::localstorage'
                },
                {
                    name: 'rest',
                    factory: 'sy::core::storage::factory::engine::rest',
                    mapper: 'sy::core::storage::storemapper::rest'
                }
            ]
        }
    },
    controllers: {
        cache: true
    }
});

Sy.kernel.getServiceContainer()
    .setParameters(Sy.kernel.getConfig().get('parameters'))
    .set({
        'sy::core::generator::uuid': {
            constructor: 'Sy.Lib.Generator.UUID'
        },
        'sy::core::mediator': {
            constructor: 'Sy.Lib.Mediator',
            calls: [
                ['setGenerator', ['@sy::core::generator::uuid']],
                ['setLogger', ['@sy::core::logger']]
            ]
        },
        'sy::core::http::rest': {
            constructor: 'Sy.HTTP.REST',
            calls: [
                ['setManager', ['@sy::core::http']]
            ]
        },
        'sy::core::registry::factory': {
            constructor: 'Sy.RegistryFactory'
        },
        'sy::core::stateregistry::factory': {
            constructor: 'Sy.StateRegistryFactory',
            calls: [
                ['setRegistryFactory', ['@sy::core::registry::factory']]
            ]
        },
        'sy::core::view::parser': {
            constructor: 'Sy.View.Parser'
        },
        'sy::core::view::factory::list': {
            constructor: 'Sy.View.ListFactory',
            calls: [
                ['setTemplateEngine', ['@sy::core::view::template::engine']]
            ]
        },
        'sy::core::view::factory::layout': {
            constructor: 'Sy.View.LayoutFactory',
            calls: [
                ['setParser', ['@sy::core::view::parser']],
                ['setTemplateEngine', ['@sy::core::view::template::engine']],
                ['setRegistryFactory', ['@sy::core::registry::factory']],
                ['setListFactory', ['@sy::core::view::factory::list']]
            ]
        },
        'sy::core::view::factory::viewscreen': {
            constructor: 'Sy.View.ViewScreenFactory',
            calls: [
                ['setParser', ['@sy::core::view::parser']],
                ['setTemplateEngine', ['@sy::core::view::template::engine']],
                ['setRegistryFactory', ['@sy::core::registry::factory']],
                ['setLayoutFactory', ['@sy::core::view::factory::layout']],
                ['setDefinedWrappers', ['%app.meta.viewscreens%']]
            ]
        },
        'sy::core::storage::factory::engine::indexeddb': {
            constructor: 'Sy.Storage.EngineFactory.IndexedDBFactory',
            calls: [
                ['setLogger', ['@sy::core::logger']],
                ['setMediator', ['@sy::core::mediator']]
            ]
        },
        'sy::core::storage::factory::engine::localstorage': {
            constructor: 'Sy.Storage.EngineFactory.LocalstorageFactory',
            calls: [
                ['setLogger', ['@sy::core::logger']],
                ['setMediator', ['@sy::core::mediator']]
            ]
        },
        'sy::core::storage::factory::engine::rest': {
            constructor: 'Sy.Storage.EngineFactory.RestFactory',
            calls: [
                ['setLogger', ['@sy::core::logger']],
                ['setMediator', ['@sy::core::mediator']],
                ['setManager', ['@sy::core::http::rest']]
            ]
        },
        'sy::core::storage::storemapper::indexeddb': {
            constructor: 'Sy.Storage.StoreMapper.IndexedDBMapper'
        },
        'sy::core::storage::storemapper::localstorage': {
            constructor: 'Sy.Storage.StoreMapper.LocalstorageMapper'
        },
        'sy::core::storage::storemapper::rest': {
            constructor: 'Sy.Storage.StoreMapper.RestMapper'
        },
        'sy::core::storage::unitofwork::factory': {
            constructor: 'Sy.Storage.UnitOfWorkFactory',
            calls: [
                ['setGenerator', ['@sy::core::generator::uuid']],
                ['setStateRegistryFactory', ['@sy::core::stateregistry::factory']]
            ]
        },
        'sy::core::storage::repository::factory': {
            constructor: 'Sy.Storage.RepositoryFactory',
            calls: [
                ['setRegistryFactory', ['@sy::core::registry::factory']],
                ['setUOWFactory', ['@sy::core::storage::unitofwork::factory']],
                ['setMeta', ['%app.meta.entities%']]
            ]
        },
        'sy::core::form': {
            constructor: 'Sy.Form.Builder',
            calls: [
                ['setValidator', ['@sy::core::validator']]
            ]
        }
    })
    .set('sy::core::logger', function () {

        var logger = new Sy.Lib.Logger.CoreLogger('core'),
            info = new Sy.Lib.Logger.Handler.Console(logger.INFO),
            debug = new Sy.Lib.Logger.Handler.Console(logger.DEBUG),
            error = new Sy.Lib.Logger.Handler.Console(logger.ERROR),
            log = new Sy.Lib.Logger.Handler.Console(logger.LOG);

        logger.setHandler(info, logger.INFO);
        logger.setHandler(debug, logger.DEBUG);
        logger.setHandler(error, logger.ERROR);
        logger.setHandler(log, logger.LOG);

        return logger;

    })
    .set('sy::core::http', function () {

        var parser = new Sy.HTTP.HeaderParser(),
            manager = new Sy.HTTP.Manager();

        manager.setParser(parser);
        manager.setGenerator(this.get('sy::core::generator::uuid'));
        manager.setRegistry(this.get('sy::core::registry::factory').make());
        manager.setLogger(this.get('sy::core::logger'));

        return manager;
    })
    .set('sy::core::storage::factory::engine::core', function () {

        var factory = new Sy.Storage.EngineFactory.Core(),
            factories = this.getParameter('storage.engines');

        factory.setRegistry(
            this.get('sy::core::registry::factory').make()
        );

        for (var i = 0, l = factories.length; i < l; i++) {
            factory.setEngineFactory(
                factories[i].name,
                this.get(factories[i].factory),
                this.get(factories[i].mapper)
            );
        }

        return factory;

    })
    .set('sy::core::storage', function () {

        var meta = this.getParameter('app.meta.entities'),
            storage = new Sy.Storage.Core(),
            managerFact = new Sy.Storage.ManagerFactory(),
            engineFact = this.get('sy::core::storage::factory::engine::core'),
            conf = this.getParameter('storage.managers'),
            registryFact = this.get('sy::core::registry::factory');

        storage.setRegistry(registryFact.make());

        managerFact
            .setEngineFactory(engineFact)
            .setRepositoryFactory(this.get('sy::core::storage::repository::factory'));

        for (var name in conf) {
            if (conf.hasOwnProperty(name)) {
                var manager = managerFact.make(name, conf[name], meta);

                storage.setManager(name, manager);
            }
        }

        return storage;

    })
    .set('sy::core::translator', function () {
        var translator = new Sy.Translator();
        translator
            .setRegistry(this.get('sy::core::registry::factory').make())
            .setStateRegistryFactory(this.get('sy::core::stateregistry::factory'));
        return translator;
    })
    .set('sy::core::view::template::engine', function () {
        var engine = new Sy.View.TemplateEngine();

        return engine
            .setRegistry(
                this.get('sy::core::registry::factory').make()
            )
            .setGenerator(
                this.get('sy::core::generator::uuid')
            );
    })
    .set('sy::core::viewport', function () {

        var viewport = new Sy.View.ViewPort();

        return viewport
            .setNode(
                document.querySelector('.viewport')
            )
            .setViewManager(
                this.get('sy::core::view::manager')
            )
            .setMediator(
                this.get('sy::core::mediator')
            );

    })
    .set('sy::core::view::manager', function () {

        var manager = new Sy.View.Manager(),
            viewscreens = this.get('sy::core::view::parser').getViewScreens();

        manager
            .setViewsRegistry(
                this.get('sy::core::registry::factory').make()
            )
            .setViewScreenFactory(
                this.get('sy::core::view::factory::viewscreen')
            );

        for (var i = 0, l = viewscreens.length; i < l; i++) {
            manager.setViewScreen(viewscreens[i]);

            if (!DOM(viewscreens[i]).isChildOf('.viewport')){
                viewscreens[i].parentNode.removeChild(viewscreens[i]);
            }
        }

        return manager;

    })
    .set('sy::core::validator', function () {
        var validator = new Sy.Validator.Core(),
            contextFactory = new Sy.Validator.ExecutionContextFactory();

        contextFactory.setConstraintValidatorFactory(new Sy.Validator.ConstraintValidatorFactory());

        return validator
            .setRulesRegistry(this.get('sy::core::registry::factory').make())
            .setContextFactory(contextFactory)
            .setConstraintFactory(new Sy.Validator.ConstraintFactory());
    });
