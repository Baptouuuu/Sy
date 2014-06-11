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
