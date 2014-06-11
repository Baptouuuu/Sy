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
