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

    if (level !== undefined) {
        this.setLevel(level);
    }

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
 * Object for requesting images via ajax
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Request}
 * @class
 */

Sy.HTTP.ImageRequest = function () {
    Sy.HTTP.Request.call(this);
    this.setType('blob');
    this.setHeader('Accept', 'image/*');
};
Sy.HTTP.ImageRequest.prototype = Object.create(Sy.HTTP.Request.prototype);

namespace('Sy.HTTP');

/**
 * Image request response as blob
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Response}
 * @lass
 */

Sy.HTTP.ImageResponse = function () {
    Sy.HTTP.Response.call(this);
};
Sy.HTTP.ImageResponse.prototype = Object.create(Sy.HTTP.Response.prototype, {

    /**
     * Return the image blob
     *
     * @return {Blob}
     */

    getBlob: {
        value: function () {
            return this.getBody();
        }
    }

})
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

                } else if (
                    headers['Content-Type'] !== undefined &&
                    headers['Content-Type'].indexOf('image/') !== -1 &&
                    request.obj.getType() === 'blob'
                ) {

                    response = new Sy.HTTP.ImageResponse();

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
    },

    /**
     * Return an array of all pending xhrs
     *
     * @return {Array}
     */

    getStack: {
        value: function () {
            return this.requests.get();
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
    },

    /**
     * Set the registry as strict, meaning a key can only exist in one state
     *
     * @return {Sy.StateRegistryInterface}
     */

    setStrict: {
        value: function () {}
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
    this.strict = false;
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

            if (this.strict === true) {
                var oldState = this.state(key);

                if (oldState !== undefined) {
                    this.remove(oldState, key);
                }
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
    },

    /**
     * @inheritDoc
     */

    setStrict: {
        value: function () {
            this.strict = true;

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
namespace('Sy');

/**
 * Entity interface
 *
 * @package Sy
 * @interface
 */

Sy.EntityInterface = function () {};
Sy.EntityInterface.prototype = Object.create(Object.prototype, {

    UUID: {
        value: 'uuid'
    },

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

Sy.Entity = function () {};
Sy.Entity.prototype = Object.create(Sy.EntityInterface.prototype, {

    INDEXES: {
        value: [],
        enumerable: false
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
                this[attr] = value;
            }

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (attr) {
            return this[attr];
        }
    }

});
namespace('Sy.Storage');

/**
 * Entry point to the storage mechanism
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.Core = function () {
    this.managers = null;
    this.defaultName = 'default';
    this.factory = null;
};
Sy.Storage.Core.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold managers
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.Core} self
     */

    setManagersRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.managers = registry;

            return this;
        }
    },

    /**
     * Set the default manager name
     *
     * @param {String} defaultName
     *
     * @return {Sy.Storage.Core} self
     */

    setDefaultManager: {
        value: function (defaultName) {
            this.defaultName = defaultName || 'default';

            return this;
        }
    },

    /**
     * Set the manager factory
     *
     * @param {Sy.Storage.ManagerFactory} factory
     *
     * @return {Sy.Storage.Core} self
     */

    setManagerFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.ManagerFactory)) {
                throw new TypeError('Invalid manager factory');
            }

            this.factory = factory;

            return this;
        }
    },

    /**
     * Get an entity manager
     *
     * @param {String} name Manager name, optional
     *
     * @return {Sy.Storage.Manager}
     */

    getManager: {
        value: function (name) {
            name = name || this.defaultName;

            if (this.managers.has(name)) {
                return this.managers.get(name);
            }

            var manager = this.factory.make(name);

            this.managers.set(name, manager);

            return manager;
        }
    }

});

namespace('Sy.Storage');

/**
 * Hold the relation between an alias and an entity constructor
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.IdentityMap = function () {
    this.aliases = [];
    this.constructors = [];
    this.prototypes = [];
    this.keys = [];
};
Sy.Storage.IdentityMap.prototype = Object.create(Object.prototype, {

    /**
     * Set a new entity definition
     *
     * @param {String} alias
     * @param {Function} entity
     * @param {String} key
     *
     * @return {Sy.Storage.IdentityMap} self
     */

    set: {
        value: function (alias, entity, key) {
            if (Object.isFrozen(this.aliases)) {
                return this;
            }

            this.aliases.push(alias);
            this.constructors.push(entity);
            this.prototypes.push(entity.prototype);
            this.keys.push(key);

            return this;
        }
    },

    /**
     * Lock the definitions so indexes are preserved (no addition nor removal)
     *
     * @return {Sy.Storage.IdentityMap} self
     */

    lock: {
        value: function () {
            Object.freeze(this.aliases);
            Object.freeze(this.constructors);
            Object.freeze(this.prototypes);
            Object.freeze(this.keys);

            return this;
        }
    },

    /**
     * Check if the given alias is defined
     *
     * @param {String} alias
     *
     * @return {Boolean}
     */

    hasAlias: {
        value: function (alias) {
            return this.aliases.indexOf(alias) !== -1;
        }
    },

    /**
     * Check if the given entity is defined
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    hasEntity: {
        value: function (entity) {
            var refl = new ReflectionObject(entity);

            return this.prototypes.indexOf(refl.getPrototype()) !== -1;
        }
    },

    /**
     * Return the alias for the given entity
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {String}
     */

    getAlias: {
        value: function (entity) {
            var refl = new ReflectionObject(entity),
                idx = this.prototypes.indexOf(refl.getPrototype());

            return this.aliases[idx];
        }
    },

    /**
     * Return the entity constructor for the given alias
     *
     * @param {String} alias
     *
     * @return {Sy.EntityInterface}
     */

    getConstructor: {
        value: function (alias) {
            var idx = this.aliases.indexOf(alias);

            return this.constructors[idx];
        }
    },

    /**
     * Return the key for the specified alias
     *
     * @param {String} alias
     *
     * @return {String}
     */

    getKey: {
        value: function (alias) {
            var idx = this.aliases.indexOf(alias);

            return this.keys[idx];
        }
    }

});

namespace('Sy.Storage');

/**
 * Event fired before/after an entity is committed to the database
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.LifeCycleEvent = function (alias, entity) {
    this.alias = alias;
    this.entity = entity;
    this.aborted = false;
};
Sy.Storage.LifeCycleEvent.prototype = Object.create(Object.prototype, {

    PRE_CREATE: {
        value: 'storage.pre.create',
        writable: false
    },

    POST_CREATE: {
        value: 'storage.post.create',
        writable: false
    },

    PRE_UPDATE: {
        value: 'storage.pre.update',
        writable: false
    },

    POST_UPDATE: {
        value: 'storage.post.update',
        writable: false
    },

    PRE_REMOVE: {
        value: 'storage.pre.remove',
        writable: false
    },

    POST_REMOVE: {
        value: 'storage.post.remove',
        writable: false
    },

    /**
     * Return the alias of the entity being committed
     *
     * @return {String}
     */

    getAlias: {
        value: function () {
            return this.alias;
        }
    },

    /**
     * Return the entity being committed
     *
     * @return {Sy.EntityInterface}
     */

    getEntity: {
        value: function () {
            return this.entity;
        }
    },

    /**
     * Abort the commit to the database for this entity
     *
     * @return {Sy.Storage.LifeCycleEvent} self
     */

    abort: {
        value: function () {
            this.aborted = true;

            return this;
        }
    },

    /**
     * Check if the commit needs to be aborted
     *
     * @return {Boolean}
     */

    isAborted: {
        value: function () {
            return this.aborted;
        }
    }

});

namespace('Sy.Storage');

/**
 * Entity manager
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.Manager = function () {
    this.driver = null;
    this.uow = null;
    this.mappings = null;
    this.repoFactory = null;
};
Sy.Storage.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set the database driver
     *
     * @param {Sy.Storage.Dbal.DriverInterface} driver
     *
     * @return {Sy.Storage.Manager} self
     */

    setDriver: {
        value: function (driver) {
            if (!(driver instanceof Sy.Storage.Dbal.DriverInterface)) {
                throw new TypeError('Invalid dbal driver');
            }

            this.driver = driver;

            return this;
        }
    },

    /**
     * Return the driver
     *
     * @return {Sy.Storage.Dbal.DriverInterface}
     */

    getDriver: {
        value: function () {
            return this.driver;
        }
    },

    /**
     * Set the unit of work
     *
     * @param {Sy.Storage.UnitOfWork} uow
     *
     * @return {Sy.Storage.Manager} self
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
     * Return the UnitOfWork
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    getUnitOfWork: {
        value: function () {
            return this.uow;
        }
    },

    /**
     * Set the allowed entities to be managed here
     *
     * @param {Array} mappings
     *
     * @return {Sy.Storage.Manager} self
     */

    setMappings: {
        value: function (mappings) {
            if (!(mappings instanceof Array)) {
                throw new TypeError('Invalid mappings array');
            }

            this.mappings = mappings;

            return this;
        }
    },

    /**
     * Set the repository factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     *
     * @return {Sy.Storage.Manager} self
     */

    setRepositoryFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }
            this.repoFactory = factory;

            return this;
        }
    },

    /**
     * Get the repository for the given alias
     *
     * @param {String} alias
     *
     * @return {Sy.Storage.Repository}
     */

    getRepository: {
        value: function (alias) {
            if (!this.isHandled(alias)) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            return this.repoFactory.make(this, alias);
        }
    },

    /**
     * Find an entity by its id
     *
     * @param {String} alias Entity name alias (ie: 'Bundle::Entity')
     * @param {String} id
     *
     * @return {Promise}
     */

    find: {
        value: function (alias, id) {
            if (!this.isHandled(alias)) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            return this.uow.find(alias, id);
        }
    },

    /**
     * Plan an entity to be persisted to the database
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.Manager} self
     */

    persist: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap().getAlias(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            this.uow.persist(entity);

            return this;
        }
    },

    /**
     * Commit the changes to the database
     *
     * @return {Sy.Storage.Manager} self
     */

    flush: {
        value: function () {
            this.uow.commit();

            return this;
        }
    },

    /**
     * Plan an entity to be removed from the database
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.Manager} self
     */

    remove: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap().getAlias(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            this.uow.remove(entity);

            return this;
        }
    },

    /**
     * Detach all the entities managed
     *
     * @param {String} alias Entity alias, optional
     *
     * @return {Sy.Storage.Manager} self
     */

    clear: {
        value: function (alias) {
            this.uow.clear(alias);

            return this;
        }
    },

    /**
     * Detach an entity from the manager,
     * any changes to the entity will not be persisted
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.Manager} self
     */

    detach: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap().getAlias(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            this.uow.detach(entity);

            return this;
        }
    },

    /**
     * Tell if the entity is managed by this manager
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    contains: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap().getAlias(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            return this.uow.isManaged(entity);
        }
    },

    /**
     * Check if the alias is managed by this manager
     *
     * @private
     * @param {String} alias
     *
     * @return {Boolean}
     */

    isHandled: {
        value: function (alias) {
            if (this.mappings.length === 0) {
                return true;
            }

            return this.mappings.indexOf(alias) !== -1;
        }
    }

});

namespace('Sy.Storage');

/**
 * Build entity manager instances
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.ManagerFactory = function () {
    this.definitions = {};
    this.dbals = null;
    this.repoFactory = null;
    this.uowFactory = null;
};
Sy.Storage.ManagerFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the managers definitions
     *
     * @param {Object} definitions
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setDefinitions: {
        value: function (definitions) {
            this.definitions = definitions || {};

            return this;
        }
    },

    /**
     * Set the factory to build dbals
     *
     * @param {Sy.Storage.Dbal.Factory} factory
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setDbalFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.Dbal.Factory)) {
                throw new TypeError('Invalid dbal factory');
            }

            this.dbals = factory;

            return this;
        }
    },

    /**
     * Set the repository factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setRepositoryFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }

            this.repoFactory = factory;

            return this;
        }
    },

    /**
     * Set the unit of work factory
     *
     * @param {Sy.Storage.UnitOfWorkFactory} factory
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setUnitOfWorkFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.UnitOfWorkFactory)) {
                throw new TypeError('Invalid unit of work factory');
            }

            this.uowFactory = factory;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name) {
            if (!this.definitions.hasOwnProperty(name)) {
                throw new ReferenceError('Unknown manager definition');
            }

            var manager = new Sy.Storage.Manager(),
                uow = this.uowFactory.make(),
                driver = this.dbals.make(
                    this.definitions[name].connection
                );

            uow.setDriver(driver);

            return manager
                .setDriver(driver)
                .setRepositoryFactory(this.repoFactory)
                .setMappings(
                    this.definitions[name].mappings || []
                )
                .setUnitOfWork(uow);
        }
    }

});

namespace('Sy.Storage');

/**
 * Entity repository
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @param {Sy.Storage.Manager} em
 * @param {String} alias
 */

Sy.Storage.Repository = function (em, alias) {
    if (!(em instanceof Sy.Storage.Manager)) {
        throw new TypeError('Invalid entity manager');
    }

    this.em = em;
    this.alias = alias;
};
Sy.Storage.Repository.prototype = Object.create(Object.prototype, {

    /**
     * Detach all the entities for this entity type
     *
     * @return {Sy.Storage.Repository} self
     */

    clear: {
        value: function () {
            this.em.clear(this.alias);

            return this;
        }
    },

    /**
     * Find an entity by its id
     *
     * @param {String} id
     *
     * @return {Promise}
     */

    find: {
        value: function (id) {
            return this.em.find(this.alias, id);
        }
    },

    /**
     * Find all entities
     *
     * @return {Promise}
     */

    findAll: {
        value: function () {
            return this.em
                .getUnitOfWork()
                .findAll(this.alias);
        }
    },

    /**
     * Find all entities matching the criteria
     *
     * @param {String} index
     * @param {mixed} value Value or array of bounds
     * @param {Integer} limit optional
     *
     * @return {Promise}
     */

    findBy: {
        value: function (index, value, limit) {
            return this.em
                .getUnitOfWork()
                .findBy(this.alias, index, value, limit);
        }
    },

    /**
     * Find one entity matching the criteria
     *
     * @param {String} index
     * @param {mixed} value Value or array of bounds
     *
     * @return {Promise}
     */

    findOneBy: {
        value: function (index, value) {
            return this.em
                .getUnitOfWork()
                .findBy(this.alias, index, value, 1)
                .then(function (entities) {
                    if (entities.length === 1) {
                        return entities[0];
                    }

                    throw new ReferenceError('Entity not found');
                });
        }
    }

});

namespace('Sy.Storage');

/**
 * Build a repository for the specified alias
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.RepositoryFactory = function () {
    this.metadata = null;
    this.loaded = null;
};
Sy.Storage.RepositoryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set a registry to hold entities metadata
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.RepositoryFactory} self
     */

    setMetadataRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.metadata = registry;

            return this;
        }
    },

    /**
     * Set a registry to hold loaded repositories
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.RepositoryFactory} self
     */

    setRepositoriesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.loaded = registry;

            return this;
        }
    },

    /**
     * Set a new entity definition
     *
     * @param {String} alias
     * @param {Function} repository Repository constructor
     *
     * @return {Sy.Storage.RepositoryFactory} self
     */

    setRepository: {
        value: function (alias, repository) {
            this.metadata.set(alias, repository);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (em, alias) {
            if (this.loaded.has(alias)) {
                return this.loaded.get(alias);
            }

            if (!this.metadata.has(alias)) {
                throw new ReferenceError('Unknown entity alias "' + alias + '"');
            }

            var repo = new (this.metadata.get(alias))(
                em,
                alias
            );

            if (!(repo instanceof Sy.Storage.Repository)) {
                throw new TypeError('Invalid repository');
            }

            this.loaded.set(alias, repo);

            return repo;
        }
    }

});

namespace('Sy.Storage');

/**
 * Extract necessary information from entities metadata
 * and inject properly the repositories definition in the factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.RepositoryFactoryConfigurator = function () {
    this.metadata = null;
};
Sy.Storage.RepositoryFactoryConfigurator.prototype = Object.create(Object.prototype, {

    /**
     * Set the entities metadata
     *
     * @param {Array} metadata
     */

    setMetadata: {
        value: function (metadata) {
            this.metadata = metadata;
        }
    },

    /**
     * Inject the repositories definitions in the factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     */

    configure: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }

            for (var i = 0, l = this.metadata.length; i < l; i++) {
                factory.setRepository(
                    this.metadata[i].alias,
                    this.metadata[i].repository || Sy.Storage.Repository
                );
            }
        }
    }

});

namespace('Sy.Storage');

/**
 * Bridge between database driver and entity level
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.UnitOfWork = function () {
    this.driver = null;
    this.map = null;
    this.entities = null;
    this.states = null;
    this.propertyAccessor = null;
    this.scheduledForInsert = [];
    this.scheduledForUpdate = [];
    this.scheduledForDelete = [];
    this.logger = null;
    this.generator = null;
    this.mediator = null;
};
Sy.Storage.UnitOfWork.prototype = Object.create(Object.prototype, {

    STATE_NEW: {
        value: 'new',
        writable: false,
    },

    STATE_MANAGED: {
        value: 'managed',
        writable: false
    },

    STATE_DETACHED: {
        value: 'detached',
        writable: false
    },

    STATE_REMOVED: {
        value: 'removed',
        writable: false
    },

    /**
     * Set the database driver
     *
     * @param {Sy.Storage.Dbal.DriverInterface} driver
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setDriver: {
        value: function (driver) {
            if (!(driver instanceof Sy.Storage.Dbal.DriverInterface)) {
                throw new TypeError('Invalid database driver');
            }

            this.driver = driver;

            return this;
        }
    },

    /**
     * Set the identity map
     *
     * @param {Sy.Storage.IdentityMap} map
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setIdentityMap: {
        value: function (map) {
            if (!(map instanceof Sy.Storage.IdentityMap)) {
                throw new TypeError('Invalid identity map');
            }

            this.map = map;

            return this;
        }
    },

    /**
     * Return the identity map
     *
     * @return {Sy.Storage.IdentityMap}
     */

    getIdentityMap: {
        value: function () {
            return this.map;
        }
    },

    /**
     * Set a state registry to hold loaded entities
     *
     * @param {Sy.StateRegistryInterface} registry
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setEntitiesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.StateRegistryInterface)) {
                throw new TypeError('Invalid state registry');
            }

            this.entities = registry;

            return this;
        }
    },

    /**
     * Set a property accessor
     *
     * @param {Sy.PropertyAccessor} accessor
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setPropertyAccessor: {
        value: function (accessor) {
            if (!(accessor instanceof Sy.PropertyAccessor)) {
                throw new TypeError('Invalid property accessor');
            }

            this.propertyAccessor = accessor;

            return this;
        }
    },

    /**
     * Set a state registry to hold entities states
     *
     * @param {Sy.StateRegistryInterface} registry
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setStatesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.StateRegistryInterface)) {
                throw new TypeError('Invalid state registry');
            }

            this.states = registry;

            return this;
        }
    },

    /**
     * Set a logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.UnitOfWork} self
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
     * Set a generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWork} self
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
     * Set the mediator
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Storage.UnitOfWork} self
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
     * Find an entity for the specified id
     *
     * @param {String} alias
     * @param {String} id
     *
     * @return {Promise}
     */

    find: {
        value: function (alias, id) {
            if (this.entities.has(alias, id)) {
                return new Promise(function (resolve) {
                    resolve(this.entities.get(alias, id));
                }.bind(this));
            }

            return this.driver
                .read(alias, id)
                .then(function (data) {
                    return this.buildEntity(alias, data);
                }.bind(this));
        }
    },

    /**
     * Find all the entities for the given alias
     *
     * @param {String} alias
     *
     * @return {Promise}
     */

    findAll: {
        value: function (alias) {
            return this.driver
                .findAll(alias)
                .then(function (data) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        data[i] = this.buildEntity(alias, data[i]);
                    }

                    return data;
                }.bind(this));
        }
    },

    /**
     * Find entities matching the given alias and criteria
     *
     * @param {String} alias
     * @param {String} index
     * @param {mixed} value
     * @param {Integer} limit
     *
     * @return {Promise}
     */

    findBy: {
        value: function (alias, index, value, limit) {
            return this.driver
                .find(alias, index, value, limit)
                .then(function (data) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        data[i] = this.buildEntity(alias, data[i]);
                    }

                    return data;
                }.bind(this));
        }
    },

    /**
     * Build an entity for the specified alias
     *
     * @private
     * @param {String} alias
     * @param {Object} data
     *
     * @return {Sy.EntityInterface}
     */

    buildEntity: {
        value: function (alias, data) {
            var constructor = this.map.getConstructor(alias),
                key = this.map.getKey(alias),
                entity;

            if (this.entities.has(alias, data[key])) {
                entity = this.entities.get(alias, data[key]);
            } else {
                entity = new constructor();
                this.entities.set(alias, data[key], entity);

                (new ObjectObserver(entity))
                    .open(function () {
                        this.computeSchedules(entity);
                    }.bind(this));
            }

            for (var p in data) {
                if (data.hasOwnProperty(p)) {
                    entity.set(p, data[p]);
                }
            }

            this.states.set(this.STATE_MANAGED, data[key], data[key]);

            return entity;
        }
    },

    /**
     * Plan the given entity to be persisted
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    persist: {
        value: function (entity) {
            if (!(entity instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity');
            }

            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                id = this.propertyAccessor.getValue(entity, key),
                state = this.states.state(id);

            if (state === undefined) {
                id = this.generator.generate();
                this.states.set(
                    this.STATE_NEW,
                    id,
                    id
                );
                this.scheduledForInsert.push(entity);
                this.propertyAccessor.setValue(entity, key, id);

                (new ObjectObserver(entity))
                    .open(function () {
                        this.computeSchedules(entity);
                    }.bind(this));
            } else {
                this.scheduledForUpdate.push(entity);
            }

            this.entities.set(alias, id, entity);

            return this;
        }
    },

    /**
     * Commit the changes to the database
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    commit: {
        value: function () {
            Platform.performMicrotaskCheckpoint();

            this.scheduledForInsert.forEach(function (entity) {
                var alias = this.map.getAlias(entity),
                    key = this.map.getKey(alias),
                    id = this.propertyAccessor.getValue(entity, key),
                    event = new Sy.Storage.LifeCycleEvent(alias, entity);

                this.mediator && this.mediator.publish(
                    event.PRE_CREATE,
                    event
                );

                if (event.isAborted()) {
                    return;
                }

                this.driver
                    .create(alias, this.getEntityData(entity))
                    .then(function () {
                        this.states.set(
                            this.STATE_MANAGED,
                            id,
                            id
                        );

                        this.mediator && this.mediator.publish(
                            event.POST_CREATE,
                            event
                        );

                        this.logger && this.logger.info(
                            'Entity created',
                            entity
                        );
                    }.bind(this));
            }, this);
            this.scheduledForUpdate.forEach(function (entity) {
                var alias = this.map.getAlias(entity),
                    key = this.map.getKey(alias),
                    id = this.propertyAccessor.getValue(entity, key),
                    event = new Sy.Storage.LifeCycleEvent(alias, entity);

                this.mediator && this.mediator.publish(
                    event.PRE_UPDATE,
                    event
                );

                if (event.isAborted()) {
                    return;
                }

                this.driver
                    .update(
                        alias,
                        id,
                        this.getEntityData(entity)
                    )
                    .then(function () {
                        this.mediator && this.mediator.publish(
                            event.POST_UPDATE,
                            event
                        );

                        this.logger && this.logger.info(
                            'Entity updated',
                            entity
                        );
                    });
            }, this);
            this.scheduledForDelete.forEach(function (entity) {
                var alias = this.map.getAlias(entity),
                    key = this.map.getKey(alias),
                    id = this.propertyAccessor.getValue(entity, key),
                    event = new Sy.Storage.LifeCycleEvent(alias, entity);

                this.mediator && this.mediator.publish(
                    event.PRE_REMOVE,
                    event
                );

                if (event.isAborted()) {
                    return;
                }

                this.driver
                    .remove(alias, id)
                    .then(function () {
                        this.states.set(
                            this.STATE_REMOVED,
                            id,
                            id
                        );

                        this.mediator && this.mediator.publish(
                            event.POST_REMOVE,
                            event
                        );

                        this.logger && this.logger.info(
                            'Entity removed',
                            entity
                        )
                    }.bind(this));
            }, this);

            //reinitialize schedules so 2 close commits can't trigger
            //an entity to be sent to the driver twice
            this.scheduledForInsert.splice(0);
            this.scheduledForUpdate.splice(0);
            this.scheduledForDelete.splice(0);

            return this;
        }
    },

    /**
     * Plan the entity to be removed from the database
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    remove: {
        value: function (entity) {
            if (!(entity instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity');
            }

            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                state = this.states.state(
                    this.propertyAccessor.getValue(entity, key)
                );

            if (state === this.STATE_MANAGED) {
                if (this.isScheduledForUpdate(entity)) {
                    this.scheduledForUpdate.splice(
                        this.scheduledForUpdate.indexOf(entity),
                        1
                    );
                }

                this.scheduledForDelete.push(entity);
            } else if (state === this.STATE_NEW) {
                this.scheduledForInsert.splice(
                    this.scheduledForInsert.indexOf(entity),
                    1
                );
            }

            return this;
        }
    },

    /**
     * Detach all entities or the ones of the given alias
     *
     * @param {String} alias optional
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    clear: {
        value: function (alias) {
            var entities = this.entities.get(),
                constructor;

            for (var a in entities) {
                if (entities.hasOwnProperty(a)) {

                    if (alias !== undefined && alias !== a) {
                        continue;
                    }

                    for (var i = 0, l = entities[a].length; i < l; i++) {
                        this.detach(entities[a][i]);
                    }

                    if (alias !== undefined && alias === a) {
                        break;
                    }
                }
            }

            return this;
        }
    },

    /**
     * Detach the given entity
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    detach: {
        value: function (entity) {
            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                id = this.propertyAccessor.getValue(entity, key);

            this.states.set(this.STATE_DETACHED, id, id);

            if (this.isScheduledForInsert(entity)) {
                this.scheduledForInsert.splice(
                    this.scheduledForInsert.indexOf(entity),
                    1
                );
            }

            if (this.isScheduledForUpdate(entity)) {
                this.scheduledForUpdate.splice(
                    this.scheduledForUpdate.indexOf(entity),
                    1
                );
            }

            if (this.isScheduledForDelete(entity)) {
                this.scheduledForDelete.splice(
                    this.scheduledForDelete.indexOf(entity),
                    1
                );
            }

            return this;
        }
    },

    /**
     * Check if the entity is managed
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isManaged: {
        value: function (entity) {
            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                id = this.propertyAccessor.getValue(entity, key);
                state = this.states.state(id);

            return [this.STATE_NEW, this.STATE_MANAGED].indexOf(state) !== -1;
        }
    },

    /**
     * Check if the entity is scheduled for insertion
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForInsert: {
        value: function (entity) {
            return this.scheduledForInsert.indexOf(entity) !== -1;
        }
    },

    /**
     * Check if the entity is scheduled for update
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForUpdate: {
        value: function (entity) {
            return this.scheduledForUpdate.indexOf(entity) !== -1;
        }
    },

    /**
     * Check if the entity is scheduled for removal
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForDelete: {
        value: function (entity) {
            return this.scheduledForDelete.indexOf(entity) !== -1;
        }
    },

    /**
     * Update the schedules for the given entity
     * If entity scheduled for insert leave as is
     * otherwise plan for update except if planned for delete
     *
     * @private
     * @param {Sy.EntityInterface} entity
     */

    computeSchedules: {
        value: function (entity) {
            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                state = this.states.state(
                    this.propertyAccessor.getValue(entity, key)
                );

            if (state === this.STATE_MANAGED && !this.isScheduledForUpdate(entity)) {
                this.scheduledForUpdate.push(entity);
            }
        }
    },

    /**
     * Extract the data as a POJO from an entity
     *
     * @private
     * @param {Sy.EtityInterface} entity
     *
     * @return {Object}
     */

    getEntityData: {
        value: function (entity) {
            var data = {},
                refl = new ReflectionObject(entity);

            refl.getProperties().forEach(function (refl) {
                data[refl.getName()] = this.propertyAccessor.getValue(
                    entity,
                    refl.getName()
                );
            }.bind(this));

            return data;
        }
    }

});

namespace('Sy.Storage');

/**
 * Create a generic unit of work
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.UnitOfWorkFactory = function () {
    this.identityMap = new Sy.Storage.IdentityMap();
    this.stateRegistryFactory = null;
    this.propertyAccessor = null;
    this.logger = null;
    this.generator = null;
    this.mediator = null;
};
Sy.Storage.UnitOfWorkFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set all entities metadata
     *
     * @param {Array} metadata
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setEntitiesMetadata: {
        value: function (metadata) {
            if (!(metadata instanceof Array)) {
                throw new TypeError('Invalid metadata array');
            }

            for (var i = 0, l = metadata.length; i < l; i++) {
                this.identityMap.set(
                    metadata[i].alias,
                    metadata[i].entity,
                    metadata[i].uuid
                );
            }

            this.identityMap.lock();

            return this;
        }
    },

    /**
     * Set the state registry factory
     *
     * @param {Sy.StateRegistryFactory} factory
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
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
     * Set a property accessor
     *
     * @param {Sy.PropertyAccessor} accessor
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setPropertyAccessor: {
        value: function (accessor) {
            if (!(accessor instanceof Sy.PropertyAccessor)) {
                throw new TypeError('Invalid property accessor');
            }

            this.propertyAccessor = accessor;

            return this;
        }
    },

    /**
     * Set a logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
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
     * Set a generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
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
     * Set the mediator
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
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

    make: {
        value: function () {
            var uow = new Sy.Storage.UnitOfWork();

            return uow
                .setIdentityMap(this.identityMap)
                .setEntitiesRegistry(this.stateRegistryFactory.make())
                .setStatesRegistry(
                    this.stateRegistryFactory
                        .make()
                        .setStrict()
                )
                .setPropertyAccessor(this.propertyAccessor)
                .setLogger(this.logger)
                .setGenerator(this.generator)
                .setMediator(this.mediator);
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Factory to build a storage driver instance
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 */

Sy.Storage.Dbal.DriverFactoryInterface = function () {};
Sy.Storage.Dbal.DriverFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Build a driver instance
     *
     * @param {String} dbname
     * @param {Integer} version
     * @param {Array} stores
     * @param {Object} options
     *
     * @return {Sy.Storage.Dbal.DriverFactoryInterface} self
     */

    make: {
        value: function (dbname, version, stores, options) {}
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Minimum signature a driver must implement
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 */

Sy.Storage.Dbal.DriverInterface = function () {};
Sy.Storage.Dbal.DriverInterface.prototype = Object.create(Object.prototype, {

    /**
     * Retrieve an object by its id
     *
     * @param {String} store
     * @param {String} id
     *
     * @return {Promise}
     */

    read: {
        value: function (store, id) {}
    },

    /**
     * Create a new element in the store
     *
     * @param {String} store
     * @param {Object} object
     *
     * @return {Promise}
     */

    create: {
        value: function (store, object) {}
    },

    /**
     * Update an object in the store
     *
     * @param {String} store
     * @param {String} id
     * @param {Object} object
     *
     * @return {Promise}
     */

    update: {
        value: function (store, id, object) {}
    },

    /**
     * Delete an object from the store
     *
     * @param {String} store
     * @param {String} id
     *
     * @return {Promise}
     */

    remove: {
        value: function (store, id) {}
    },

    /**
     * Find (an) element(s) in the storage
     *
     * @param {String} store
     * @param {String} index
     * @param {Mixed} value
     * @param {Integer} limit Optional
     *
     * @return {Promise}
     */

    find: {
        value: function (store, index, value, limit) {}
    },

    /**
     * Retrieve all the objects from a store
     *
     * @param {String} store
     *
     * @return {Promise}
     */

    findAll: {
        value: function (store) {}
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Factory that leverage storage drivers factories to build a specific driver
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.Dbal.Factory = function () {
    this.factories = null;
    this.defaultConnection = 'default';
    this.connections = {};
};
Sy.Storage.Dbal.Factory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set a registry to hold drivers factories
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setFactoriesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.factories = registry;

            return this;
        }
    },

    /**
     * Set a new driver factory
     *
     * @param {String} name Driver name
     * @param {Sy.Storage.Dbal.DriverFactoryInterface} factory
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setDriverFactory: {
        value: function (name, factory) {
            if (!(factory instanceof Sy.Storage.Dbal.DriverFactoryInterface)) {
                throw new TypeError('Invalid driver factory');
            }

            if (this.factories.has(name)) {
                throw new ReferenceError('Can\'t redefine the driver factory "' + name + '"');
            }

            this.factories.set(
                name,
                factory
            );

            return this;
        }
    },

    /**
     * Set the default connection name
     *
     * @param {String} name
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setDefaultConnectionName: {
        value: function (name) {
            this.defaultConnection = name || 'default';

            return this;
        }
    },

    /**
     * Set the list of available connections
     *
     * @param {Object} connections
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setConnections: {
        value: function (connections) {
            this.connections = connections || {};

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name) {
            name = name || this.defaultConnection;

            if (!this.connections.hasOwnProperty(name)) {
                throw new ReferenceError('No connection defined with the name "' + name + '"');
            }

            var conn = this.connections[name],
                factory,
                driver;

            if (!this.factories.has(conn.driver)) {
                throw new ReferenceError('Unknown driver "' + conn.driver + '"');
            }

            factory = this.factories.get(conn.driver);
            driver = factory.make(
                conn.dbname,
                conn.version || 1,
                conn.stores || [],
                conn.options || {}
            );

            if (!(driver instanceof Sy.Storage.Dbal.DriverInterface)) {
                throw new TypeError('Invalid driver instance');
            }

            return driver;
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Storage driver leveraging IndexedDB to persist objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverInterface}
 */

Sy.Storage.Dbal.IndexedDB = function () {
    this.version = 1;
    this.connection = null;
    this.transaction = null;
    this.keyRange = null;
    this.transactionModes = {
        READ_ONLY: null,
        READ_WRITE: null
    };
    this.name = null;
    this.stores = {};
    this.storage = null;
    this.logger = null;
    this.opened = false;
    this.openingCheckInterval = null;
};
Sy.Storage.Dbal.IndexedDB.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {

    /**
     * Set the storage name
     *
     * @param {String} name
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * Set the storage version
     *
     * @param {Integer} version
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setVersion: {
        value: function (version) {
            this.version = version || 1;

            return this;
        }
    },

    /**
     * Set the connection object to IndexedDB
     *
     * @param {IDBFactory} conn
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setConnection: {
        value: function (conn) {
            if (!(conn instanceof IDBFactory)) {
                throw new TypeError('Invalid connection');
            }

            this.connection = conn;

            return this;
        }
    },

    /**
     * Set transaction object
     *
     * @param {IDBTransaction} transaction
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setTransaction: {
        value: function (transaction) {
            this.transaction = transaction;
            this.transactionModes.READ_ONLY = transaction.READ_ONLY || 'readonly';
            this.transactionModes.READ_WRITE = transaction.READ_WRITE || 'readwrite';

            return this;
        }
    },

    /**
     * Set key range object
     *
     * @param {IDBKeyRange} keyRange
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setKeyRange: {
        value: function (keyRange) {
            this.keyRange = keyRange;

            return this;
        }
    },

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
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
     * Set a new store
     *
     * @param {String} alias
     * @param {String} name
     * @param {String} identifier
     * @param {Array} indexes
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
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
     * Open the connection to the database
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    open: {
        value: function () {
            var request = this.connection.open(this.name, this.version);

            request.onupgradeneeded = this.upgradeDatabase.bind(this);
            request.onsuccess = function (event) {
                this.storage = event.target.result;
                this.opened = true;
                this.storage.onerror = function (event) {
                    this.logger && this.logger.error('Database operation failed', [this.name, event]);
                };

                this.logger && this.logger.info('Database opened', this.name);
            }.bind(this);
            request.onerror = function (event) {
                this.logger && this.logger.error('Database opening failed', [this.name, event]);
            }.bind(this);
            request.onblocked = function (event) {
                this.logger && this.logger.error('Database opening failed! (blocked by browser setting)', [this.name, event]);
            }.bind(this);

            return this;
        }
    },

    /**
     * Return a promise to know when the database is opened
     *
     * @return {Promise}
     */

    whenOpened: {
        value: function () {
            return new Promise(function (resolve) {
                if (this.opened === true) {
                    resolve();
                    return;
                }

                this.openingCheckInterval = setInterval(function () {
                    if (this.opened === true) {
                        resolve();
                        clearInterval(this.openingCheckInterval);
                    }
                }.bind(this), 50);
            }.bind(this))
        }
    },

    /**
     * Upgrade the definition of the database
     *
     * @private
     * @param {Object} event
     */

    upgradeDatabase: {
        value: function (event) {
            var objectStore;

            this.logger && this.logger.info('Upgrading database...', [this.name, this.version]);

            this.storage = event.target.result;

            for (var store in this.stores) {
                if (this.stores.hasOwnProperty(store)) {
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

    read: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_ONLY
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.get(id);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Read operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Read operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (storeName, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_WRITE
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.put(object);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Create operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Create operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, id, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_WRITE
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.put(object);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Update operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Update operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_WRITE
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.delete(id);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));

                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Delete operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Delete operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    find: {
        value: function (storeName, indexName, value, limit) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_ONLY
                        ),
                        objectStore = transaction.objectStore(store.path),
                        index = objectStore.index(indexName),
                        results = [],
                        keyRange,
                        request;

                    if (value instanceof Array && value.length === 2) {

                        if (value[0] === undefined) {
                            keyRange = this.keyRange.upperBound(value[1]);
                        } else if (value[1] === undefined) {
                            keyRange = this.keyRange.lowerBound(value[0]);
                        } else {
                            keyRange = this.keyRange.bound(value[0], value[1]);
                        }

                    } else {
                        keyRange = this.keyRange.only(value);
                    }

                    request = index.openCursor(keyRange);

                    request.addEventListener('success', function (event) {

                        var result = event.target.result;

                        if (!!result === false) {
                            if (limit !== undefined) {
                                resolve(results.slice(0, limit));
                            } else {
                                resolve(results);
                            }
                            return;
                        }

                        results.push(result.value);
                        result.continue();

                    });
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Search operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Search operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    findAll: {
        value: function (storeName) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_ONLY
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.openCursor(),
                        results = [];

                    request.addEventListener('success', function (event) {

                        var result = event.target.result;

                        if (!!result === false) {
                            resolve(results);
                            return;
                        }

                        results.push(result.value);
                        result.continue();

                    });
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Search operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Search operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * IndexedDB driver factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverFactoryInterface}
 */

Sy.Storage.Dbal.IndexedDBFactory = function () {
    this.meta = [];
    this.logger = null;
};
Sy.Storage.Dbal.IndexedDBFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {

    /**
     * Set all the defined entities
     *
     * @param {Array} meta
     *
     * @return {Sy.Storage.Dbal.IndexedDBFactory} self
     */

    setEntitiesMeta: {
        value: function (meta) {
            this.meta = meta;

            return this;
        }
    },

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.Dbal.IndexedDBFactory} self
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
     * @inheritDoc
     */

    make: {
        value: function (dbname, version, stores, options) {
            var driver = new Sy.Storage.Dbal.IndexedDB();

            driver
                .setName(dbname)
                .setVersion(version)
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
                .setLogger(this.logger);

            for (var i = 0, l = this.meta.length; i < l; i++) {
                if (stores.length === 0 || stores.indexOf(this.meta[i].alias) !== -1) {
                    driver.setStore(
                        this.meta[i].alias,
                        this.meta[i].alias.toLowerCase(),
                        this.meta[i].uuid,
                        this.meta[i].indexes
                    );
                }
            }

            return driver.open();
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Storage driver leveraging Storage to persist objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverInterface}
 */

Sy.Storage.Dbal.Localstorage = function () {
    this.storage = null;
    this.stores = {};
    this.data = null;
    this.name = null;
};
Sy.Storage.Dbal.Localstorage.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {

    /**
     * Set the database name
     *
     * @param {String} name
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * Set the storage connection
     *
     * @param {Storage} storage
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    setConnection: {
        value: function (storage) {
            if (!(storage instanceof Storage)) {
                throw new TypeError('Invalid storage');
            }

            this.storage = storage;

            return this;
        }
    },

    /**
     * Set a new store
     *
     * @param {String} alias
     * @param {String} name
     * @param {String} identifier
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    setStore: {
        value: function (alias, name, identifier) {
            this.stores[alias] = {
                path: name,
                key: identifier
            };

            return this;
        }
    },

    /**
     * Open the storage and load the data
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    open: {
        value: function () {
            var data = this.storage.getItem(this.name);

            if (!data) {
                this.createStorage();
            } else {
                this.data = JSON.parse(data);
            }

            return this;
        }
    },

    /**
     * Initialize the database structure
     *
     * @private
     */

    createStorage: {
        value: function () {
            this.data = {};

            for (var store in this.stores) {
                if (this.stores.hasOwnProperty(store)) {
                    this.data[this.stores[store].path] = {};
                }
            }

            this.commit();

            return this;
        }
    },

    /**
     * Write the data to the database
     *
     * @private
     */

    commit: {
        value: function () {
            this.storage.setItem(this.name, JSON.stringify(this.data));
        }
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                if (this.data[store.path].hasOwnProperty(id)) {
                    resolve(this.data[store.path][id]);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (storeName, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.data[store.path][object[store.key]] = object;
                this.commit();

                resolve(object[store.key]);
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, id, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.data[store.path][id] = object;
                this.commit();

                resolve(object);
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                delete this.data[store.path][id];
                this.commit();

                resolve();
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    find: {
        value: function (storeName, index, value, limit) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                }

                var store = this.stores[storeName],
                    data = [],
                    d;

                for (var key in this.data[store.path]) {
                    if (this.data[store.path].hasOwnProperty(key)) {
                        d = this.data[store.path][key];

                        if (value instanceof Array) {
                            if (
                                (
                                    value[0] === undefined &&
                                    d[index] <= value[1]
                                ) ||
                                (
                                    value[1] === undefined &&
                                    d[index] >= value[0]
                                ) ||
                                (
                                    d[index] >= value[0] &&
                                    d[index] <= value[1]
                                )
                            ) {
                                data.push(d);
                            }

                        } else if (d[index] === value) {
                            data.push(d);
                        }
                    }
                }

                if (limit !== undefined) {
                    data = data.slice(0, limit);
                }

                resolve(data);
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    findAll: {
        value: function (storeName) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName],
                    data = [];

                for (var key in this.data[store.path]) {
                    if (this.data[store.path].hasOwnProperty(key)) {
                        data.push(this.data[store.path][key]);
                    }
                }

                resolve(data);
            }.bind(this));
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * LocalStorage driver factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverFactoryInterface}
 */

Sy.Storage.Dbal.LocalstorageFactory = function () {
    this.meta = [];
};
Sy.Storage.Dbal.LocalstorageFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {

    /**
     * Set all the defined entities
     *
     * @param {Array} meta
     *
     * @return {Sy.Storage.Dbal.LocalstorageFactory} self
     */

    setEntitiesMeta: {
        value: function (meta) {
            this.meta = meta;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (dbname, version, stores, options) {
            var driver = new Sy.Storage.Dbal.Localstorage();

            driver
                .setName(dbname)
                .setConnection(
                    options.temporary === true ?
                        localStorage :
                        sessionStorage
                );

            for (var i = 0, l = this.meta.length; i < l; i++) {
                if (stores.length === 0 || stores.indexOf(this.meta[i].alias) !== -1) {
                    driver.setStore(
                        this.meta[i].alias,
                        this.meta[i].alias.toLowerCase(),
                        this.meta[i].uuid
                    );
                }
            }

            return driver.open();
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Storage driver leveraging HTTP to persist objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverInterface}
 */

Sy.Storage.Dbal.Rest = function () {
    this.pattern = null;
    this.version = 1;
    this.connection = null;
    this.logger = null;
    this.headers = {};
    this.stores = {};
};
Sy.Storage.Dbal.Rest.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {

    /**
     * Set the url pattern
     *
     * @param {String} pattern
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setURLPattern: {
        value: function (pattern) {
            if (!(/.*\/$/).test(pattern)) {
                pattern += '/';
            }

            this.pattern = pattern;

            return this;
        }
    },

    /**
     * Set the version
     *
     * @param {Integer} version
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setVersion: {
        value: function (version) {
            if (this.pattern) {
                this.pattern = this.pattern.replace('{version}', version);
            }

            this.version = version;

            return this;
        }
    },

    /**
     * Set the REST engine
     *
     * @param {Sy.HTTP.REST} rest
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setConnection: {
        value: function (rest) {
            if (!(rest instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid rest engine');
            }

            this.connection = rest;

            return this;
        }
    },

    /**
     * Set a header to be passed on each http request
     *
     * @param {String} name
     * @param {String} value
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setHeader: {
        value: function (name, value) {
            this.headers[name] = value;

            return this;
        }
    },

    /**
     * Set a new store
     *
     * @param {String} alias
     * @param {String} bundle
     * @param {String} name
     * @param {String} identifier
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setStore: {
        value: function (alias, bundle, name, identifier) {
            this.stores[alias] = {
                bundle: bundle,
                name: name,
                key: identifier,
                path: this.urlPattern
                    .replace('{bundle}', bundle)
                    .replace('{name}', name)
                    .replace('{bundle|lower}', bundle.toLowerCase())
                    .replace('{name|lower}', name.toLowerCase())
            };

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.connection.get({
                    uri: store.path + id,
                    headers: this.headers,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_OK) {
                            resolve(resp.getBody());
                        } else {
                            reject(
                                resp.getStatusCode().toString() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (storeName, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.connection.post({
                    uri: store.path,
                    headers: this.headers,
                    data: object,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_CREATED) {
                            resolve(resp.getBody()[store.key]);
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, id, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.connection.put({
                    uri: store.path + id,
                    headers: this.headers,
                    data: object,
                    listener: function (resp) {
                        if (
                            resp.getStatusCode() === resp.HTTP_OK ||
                            resp.getStatusCode() === resp.HTTP_CREATED
                        ) {
                            resolve(resp.getBody());
                        } else if (resp.getStatusCode() === resp.HTTP_NO_CONTENT) {
                            resolve(object);
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.connection.remove({
                    uri: store.path + id,
                    headers: this.headers,
                    listener: function (resp) {
                        if (
                            resp.getStatusCode() === resp.HTTP_OK ||
                            resp.getStatusCode() === resp.HTTP_ACCEPTED ||
                            resp.getStatusCode() === resp.HTTP_NO_CONTENT
                        ) {
                            resolve()
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }
                });
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    find: {
        value: function (storeName, index, value, limit) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName],
                    path = store.path;

                path += '?' + index + '=' + (value instanceof Array ?
                    JSON.stringify(value) :
                    value);

                if (limit !== undefined) {
                    path += '&limit=' + limit;
                }

                this.connection.get({
                    uri: encodeURI(path),
                    headers: this.headers,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_OK) {
                            resolve(resp.getBody());
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    findAll: {
        value: function (storeName) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.connection.get({
                    uri: store.path,
                    headers: this.headers,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_OK) {
                            resolve(resp.getBody());
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Rest driver factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverFactoryInterface}
 */

Sy.Storage.Dbal.RestFactory = function () {
    this.meta = [];
    this.rest = null;
};
Sy.Storage.Dbal.RestFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {

    /**
     * Set all the defined entities
     *
     * @param {Array} meta
     *
     * @return {Sy.Storage.Dbal.RestFactory} self
     */

    setEntitiesMeta: {
        value: function (meta) {
            this.meta = meta;

            return this;
        }
    },

    /**
     * Set the REST engine
     *
     * @param {Sy.HTTP.REST} rest
     *
     * @return {Sy.Storage.Dbal.RestFactory} self
     */

    setREST: {
        value: function (rest) {
            if (!(rest instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid rest engine');
            }

            this.rest = rest;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (dbname, version, stores, options) {
            var driver = new Sy.Storage.Dbal.Rest();

            driver
                .setURLPattern(options.pattern)
                .setVersion(version)
                .setConnection(this.rest);

            if (options.headers instanceof Array) {
                for (var id = 0, l = options.headers.length; i < l; i++) {
                    driver.setHeader(
                        options.headers[0],
                        options.headers[1]
                    );
                }
            }

            for (var i = 0, l = this.meta.length; i < l; i++) {
                if (stores.length === 0 || stores.indexOf(this.meta[i].alias) !== -1) {
                    driver.setStore(
                        this.meta[i].alias,
                        this.meta[i].bundle,
                        this.meta[i].name,
                        this.meta[i].uuid
                    );
                }
            }

            return driver;
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
