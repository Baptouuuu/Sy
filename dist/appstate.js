/*! sy#0.9.1 - 2014-10-04 */
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
namespace('Sy.AppState');

/**
 * Represent a URL
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.Route = function () {
    this.name = null;
    this.path = null;
    this.parameters = {};
    this.requirements = {};
    this.regex = null;
};
Sy.AppState.Route.prototype = Object.create(Object.prototype, {

    /**
     * Set the route name
     *
     * @param {String} name
     *
     * @return {Sy.AppState.Route} self
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * Return the route name
     *
     * @return {String}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Set the path
     *
     * @param {String} path
     *
     * @return {Sy.AppState.Route} self
     */

    setPath: {
        value: function (path) {
            this.path = path;

            return this;
        }
    },

    /**
     * Return the path
     *
     * @return {String}
     */

    getPath: {
        value: function () {
            return this.path;
        }
    },

    /**
     * Set the parameters
     *
     * @param {Object} params
     *
     * @return {Sy.AppState.Route} self
     */

    setParameters: {
        value: function (params) {
            if (!Object.isFrozen(this.parameters)) {
                this.parameters = params;
            }

            Object.freeze(this.parameters);

            return this;
        }
    },

    /**
     * Get the parameters
     *
     * @return {Object}
     */

    getParameters: {
        value: function () {
            return this.parameters;
        }
    },

    /**
     * Check if the route has a parameter
     *
     * @param {String} name
     *
     * @return {Boolean}
     */

    hasParameter: {
        value: function (name) {
            return this.parameters.hasOwnProperty(name);
        }
    },

    /**
     * Return a parameter value
     *
     * @param {String} name
     *
     * @return {mixed}
     */

    getParameter: {
        value: function (name) {
            return this.parameters[name];
        }
    },

    /**
     * Set the requirements
     *
     * @param {Object} req
     *
     * @return {Sy.AppState.Route} self
     */

    setRequirements: {
        value: function (req) {
            if (!Object.isFrozen(this.requirements)) {
                this.requirements = req;
            }

            Object.freeze(this.requirements);

            return this;
        }
    },

    /**
     * Return the requirements
     *
     * @return {Object}
     */

    getRequirements: {
        value: function () {
            return this.requirements;
        }
    },

    /**
     * Return a requirement
     *
     * @param {String} name
     *
     * @return {mixed}
     */

    getRequirement: {
        value: function (name) {
            return this.requirements[name];
        }
    },

    /**
     * Check if the route has a requirement
     *
     * @param {String} name
     *
     * @return {Boolean}
     */

    hasRequirement: {
        value: function (name) {
            return this.requirements.hasOwnProperty(name);
        }
    },

    /**
     * Create a regex from the path and requirements
     *
     * @return {Sy.AppState.Route} self
     */

    buildRegex: {
        value: function () {
            var placeholders = this.path.match(new RegExp(/{\w+}/g));

            this.regex = '^' + this.path + '$';

            if (placeholders instanceof Array) {
                placeholders.forEach(function (placeholder) {
                    var name = placeholder.substring(1, placeholder.length - 1);

                    if (this.hasRequirement(name)) {
                        this.regex = this.regex.replace(
                            placeholder,
                            '(' + this.getRequirement(name) + ')'
                        );
                    } else {
                        this.regex = this.regex.replace(
                            placeholder,
                            '(.+)'
                        );
                    }
                }.bind(this));
            }

            return this;
        }
    },

    /**
     * Check if a string matches the url
     *
     * @param {String} url
     *
     * @return {Boolean}
     */

    matches: {
        value: function (url) {
            return (new RegExp(this.regex)).test(url);
        }
    },

    /**
     * Return the variables from the url
     *
     * @param {String} url
     *
     * @return {Object}
     */

    getVariables: {
        value: function (url) {
            var placeholders = this.path.match(new RegExp(/{\w+}/g)),
                values = url.match(new RegExp(this.regex)),
                data = {};

            if (!placeholders) {
                return data;
            }

            placeholders = placeholders.map(function (p) {
                return p.substring(1, p.length - 1);
            });

            values = values.filter(function (val) {
                return val !== url;
            });

            for (var i = 0, l = placeholders.length; i < l; i++) {
                data[placeholders[i]] = values[i];
            }

            return data;
        }
    }

});
namespace('Sy.AppState');

/**
 * Help build urls via a route definition
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.Router = function () {
    this.provider = null;
};
Sy.AppState.Router.prototype = Object.create(Object.prototype, {

    /**
     * Set the route provider
     *
     * @param {Sy.AppState.RouteProvider} provider
     *
     * @return {Sy.AppState.Router} self
     */

    setRouteProvider: {
        value: function (provider) {
            if (!(provider instanceof Sy.AppState.RouteProvider)) {
                throw new TypeError('Invalid route provider');
            }

            this.provider = provider;

            return this;
        }
    },

    /**
     * Generate a url
     *
     * @param {String} name Route name
     * @param {Object} variables
     *
     * @return {String}
     */

    generate: {
        value: function (name, variables) {
            if (!this.provider.hasRoute(name)) {
                throw new ReferenceError('Unknown route "' + name + '"');
            }

            var route = this.provider.getRoute(name),
                params = route.getParameters(),
                url = route.getPath();

            variables = variables || {};

            for (var name in params) {
                if (
                    params.hasOwnProperty(name) &&
                    !variables.hasOwnProperty(name)
                ) {
                    variables[name] = params[name];
                }
            }

            for (var name in variables) {
                if (variables.hasOwnProperty(name)) {
                    if (
                        route.hasRequirement(name) &&
                        !(new RegExp('^' + route.getRequirement(name) + '$')).test(variables[name])
                    ) {
                        throw new SyntaxError(
                            'Variable "' + name + '" doesn\'t fulfill its requirement ' +
                            'for the route "' + route.getName() + '"'
                        );
                    }
                    url = url.replace('{' + name + '}', variables[name]);
                }
            }

            return url;
        }
    }

});
namespace('Sy.AppState');

/**
 * Holds all the routes definitions
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.RouteProvider = function () {
    this.routes = null;
};
Sy.AppState.RouteProvider.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold routes
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.AppState.RouteProvider} self
     */

    setRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.routes = registry;

            return this;
        }
    },

    /**
     * Set a route
     *
     * @param {String} name
     * @param {String} path
     * @param {Object} params Optional
     * @param {Object} requirements Optional
     *
     * @return {Sy.AppState.RouteProvider} self
     */

    setRoute: {
        value: function (name, path, params, requirements) {
            var route = new Sy.AppState.Route();

            route
                .setName(name)
                .setPath(path);

            if (typeof params === 'object') {
                route.setParameters(params);
            }

            if (typeof requirements === 'object') {
                route.setRequirements(requirements);
            }

            route.buildRegex();

            this.routes.set(name, route);

            return this;
        }
    },

    /**
     * Return a route via its name
     *
     * @param {String} name
     *
     * @return {Sy.AppState.Route}
     */

    getRoute: {
        value: function (name) {
            return this.routes.get(name);
        }
    },

    /**
     * Return all routes
     *
     * @return {Array}
     */

    getRoutes: {
        value: function () {
            return this.routes.get();
        }
    },

    /**
     * Check if a route name exist
     *
     * @param {String} name
     *
     * @return {Boolean}
     */

    hasRoute: {
        value: function (name) {
            return this.routes.has(name);
        }
    }

});
namespace('Sy.AppState');

/**
 * Entry point to handle the states mechanism
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.Core = function () {
    this.matcher = null;
    this.provider = null;
    this.generator = null;
    this.mediator = null;
    this.handler = null;
    this.currentState = null;
};
Sy.AppState.Core.prototype = Object.create(Object.prototype, {

    /**
     * Set the url matcher
     *
     * @param {Sy.AppState.UrlMatcher} matcher
     *
     * @return {Sy.AppState.Core} self
     */

    setUrlMatcher: {
        value: function (matcher) {
            if (!(matcher instanceof Sy.AppState.UrlMatcher)) {
                throw new TypeError('Invalid url matcher');
            }

            this.matcher = matcher;

            return this;
        }
    },

    /**
     * Set the route provider
     *
     * @param {Sy.AppState.RouteProvider} provider
     *
     * @return {Sy.AppState.Core} self
     */

    setRouteProvider: {
        value: function (provider) {
            if (!(provider instanceof Sy.AppState.RouteProvider)) {
                throw new TypeError('Invalid route provider');
            }

            this.provider = provider;

            return this;
        }
    },

    /**
     * Set a uuid generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.AppState.Core} self
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
     * Set te mediator
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.AppState.Core} self
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
     * Set the state handler
     *
     * @param {Sy.AppState.StateHandler} handler
     *
     * @return {Sy.AppState.Core} self
     */

    setStateHandler: {
        value: function (handler) {
            if (!(handler instanceof Sy.AppState.StateHandler)) {
                throw new TypeError('Invalid state handler');
            }

            this.handler = handler;

            return this;
        }
    },

    /**
     * Init the url listener
     *
     * @return {Sy.AppState.Core} self
     */

    boot: {
        value: function () {
            if (history.state) {
                this.currentState = this.handler
                    .getState(history.state.uuid);
            } else {
                this.createState();
            }

            this.dispatchEvent();

            window.addEventListener('popstate', this.listenPop.bind(this), false);

            return this;
        }
    },

    /**
     * Listen the pop state event
     *
     * @private
     * @param {PopStateEvent} event
     */

    listenPop: {
        value: function (event) {
            if (!event.state) {
                this.createState();
            } else {
                this.currentState = this.handler
                    .getState(event.state.uuid);
            }

            this.dispatchEvent();
        }
    },

    /**
     * Dispatch the appstate event
     *
     * @private
     */

    dispatchEvent: {
        value: function () {
            var event = new Sy.AppState.AppStateEvent();

            event
                .setState(this.currentState)
                .setRoute(
                    this.provider
                        .getRoute(this.currentState.getRoute())
                );

            this.mediator.publish(event.KEY, event);
        }
    },

    /**
     * Create a new state and set it as the current one
     *
     * @private
     */

    createState: {
        value: function () {
            var url = this.getUrl(),
                route = this.matcher.match(url);

            this.currentState = this.handler.createState(
                this.generator.generate(),
                route.getName(),
                route.getVariables(url)
            );

            this.updateBrowserState();
        }
    },

    /**
     * Update the browser state object
     *
     * @private
     */

    updateBrowserState: {
        value: function () {
            history.replaceState(
                this.currentState.toJSON(),
                document.title
            );
        }
    },

    /**
     * Return the current url
     *
     * @return {String}
     */

    getUrl: {
        value: function () {
            return location.hash.substr(1) || '/';
        }
    },

    /**
     * Return the current state
     *
     * @return {Sy.AppState.State}
     */

    getCurrentState: {
        value: function () {
            return this.currentState;
        }
    }

});
namespace('Sy.AppState');

/**
 * Return the appropriate route corresponding to a url
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.UrlMatcher = function () {
    this.provider = null;
};
Sy.AppState.UrlMatcher.prototype = Object.create(Object.prototype, {

    /**
     * Set the route provider
     *
     * @param {Sy.AppState.RouteProvider} provider
     *
     * @return {Sy.AppState.UrlMatcher} self
     */

    setRouteProvider: {
        value: function (provider) {
            if (!(provider instanceof Sy.AppState.RouteProvider)) {
                throw new TypeError('Invalid route provider');
            }

            this.provider = provider;

            return this;
        }
    },

    /**
     * Return a route for the given url
     *
     * @param {String} url
     *
     * @return {Sy.AppState.Route}
     */

    match: {
        value: function (url) {
            var routes = this.provider.getRoutes(),
                route;

            for (var i = 0, l = routes.length; i < l; i++) {
                if (routes[i].matches(url)) {
                    route = routes[i];
                    break;
                }
            }

            if (!route) {
                throw new ReferenceError('No route found for the url "' + url + '"');
            }

            return route;
        }
    }

});
namespace('Sy.AppState');

/**
 * Represent a state of the app
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.State = function () {
    this.uuid = null;
    this.route = null;
    this.variables = {};
};
Sy.AppState.State.prototype = Object.create(Object.prototype, {

    /**
     * Set the state identifier
     *
     * @param {String} uuid
     *
     * @return {Sy.AppState.State} self
     */

    setUUID: {
        value: function (uuid) {
            this.uuid = uuid;

            return this;
        }
    },

    /**
     * Return the state identifier
     *
     * @return {String}
     */

    getUUID: {
        value: function () {
            return this.uuid;
        }
    },

    /**
     * Set the route name of the state
     *
     * @param {String} name
     *
     * @return {Sy.AppState.State} self
     */

    setRoute: {
        value: function (name) {
            this.route = name;

            return this;
        }
    },

    /**
     * Return the route name
     *
     * @return {String}
     */

    getRoute: {
        value: function () {
            return this.route;
        }
    },

    /**
     * Set the variables contained in the url
     *
     * @param {Object} variables
     *
     * @return {Sy.AppState.State} self
     */

    setVariables: {
        value: function (variables) {
            this.variables = variables;

            return this;
        }
    },

    /**
     * Return the variables
     *
     * @return {Object}
     */

    getVariables: {
        value: function () {
            return this.variables;
        }
    },

    /**
     * Return a raw representation of the state
     *
     * @return {Object}
     */

    toJSON: {
        value: function () {
            return {
                uuid: this.uuid,
                route: this.route,
                variables: this.variables
            };
        }
    }

});
namespace('Sy.AppState');

/**
 * Holds all the app states and handles saving/retrieval
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.StateHandler = function () {
    this.storage = localStorage;
    this.key = 'sy::history';
    this.states = [];

    this.loadStates();

    window.addEventListener(
        'beforeunload',
        this.saveHistory.bind(this),
        false
    );
};
Sy.AppState.StateHandler.prototype = Object.create(Object.prototype, {

    /**
     * Load all the states from the storage
     */

    loadStates: {
        value: function () {
            var states = this.storage.getItem(this.key);

            if (states) {
                states = JSON.parse(states);

                states.forEach(function (raw) {
                    this.states.push(
                        this.createState(
                            raw.uuid,
                            raw.route,
                            raw.variables
                        )
                    );
                }.bind(this));
            }
        }
    },

    /**
     * Create a new state
     *
     * @param {String} uuid
     * @param {String} route Route name
     * @param {Object} variables
     *
     * @return {Sy.AppState.State}
     */

    createState: {
        value: function (uuid, route, variables) {
            var state = new Sy.AppState.State();

            this.states.push(state);

            return state
                .setUUID(uuid)
                .setRoute(route)
                .setVariables(variables);
        }
    },

    /**
     * Retrieve the state for the given uuid
     *
     * @param {String} uuid
     *
     * @return {Sy.AppState.State}
     */

    getState: {
        value: function (uuid) {
            for (var i = 0, l = this.states.length; i < l; i++) {
                if (this.states[i].getUUID() === uuid) {
                    return this.states[i];
                }
            }
        }
    },

    /**
     * Save the history when page unload
     *
     * @private
     */

    saveHistory: {
        value: function () {
            this.storage.setItem(
                this.key,
                JSON.stringify(this.states)
            );
        }
    }

});
namespace('Sy.AppState');

/**
 * Event fired when the app state changes
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.AppStateEvent = function () {
    this.state = null;
    this.route = null;
};
Sy.AppState.AppStateEvent.prototype = Object.create(Object.prototype, {

    KEY: {
        value: 'appstate.change',
        writable: false
    },

    /**
     * Set the current app state
     *
     * @param {Sy.AppState.State} state
     *
     * @return {Sy.AppState.AppStateEvent} self
     */

    setState: {
        value: function (state) {
            if (!(state instanceof Sy.AppState.State)) {
                throw new TypeError('Invalid state object');
            }

            this.state = state;

            return this;
        }
    },

    /**
     * Return the current state
     *
     * @return {Sy.AppState.State}
     */

    getState: {
        value: function () {
            return this.state;
        }
    },

    /**
     * Set the route associated to the state
     *
     * @param {Sy.AppState.Route} route
     *
     * @return {Sy.AppState.AppStateEvent} self
     */

    setRoute: {
        value: function (route) {
            if (!(route instanceof Sy.AppState.Route)) {
                throw new TypeError('Invalid route');
            }

            this.route = route;

            return this;
        }
    },

    /**
     * Return the route
     *
     * @return {Sy.AppState.Route}
     */

    getRoute: {
        value: function () {
            return this.route;
        }
    }

});