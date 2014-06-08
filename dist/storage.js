/*! sy#0.6.0 - 2014-06-08 */
function namespace(ns) {
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

namespace("Sy"), Sy.FactoryInterface = function() {}, Sy.FactoryInterface.prototype = Object.create(Object.prototype, {
    make: {
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
}), namespace("Sy.Lib.Logger.Handler"), Sy.Lib.Logger.Handler.Interface = function() {}, 
Sy.Lib.Logger.Handler.Interface.prototype = Object.create(Object.prototype, {
    handle: {
        value: function() {}
    },
    isHandling: {
        value: function() {}
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
    this.requests = null, this.parser = null, this.generator = null, this.logger = null;
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
    setLogger: {
        value: function(logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) throw new TypeError("Invalid logger");
            return this.logger = logger, this;
        }
    },
    prepare: {
        value: function(request) {
            if (!(request instanceof Sy.HTTP.RequestInterface)) throw new TypeError("Invalid request type");
            this.logger && this.logger.info("Preparing a new HTTP request...", request);
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
            return req.data = requestData, this.requests.set(uuid, req), this.logger && this.logger.info("HTTP request prepared", req), 
            uuid;
        }
    },
    getXHR: {
        value: function(uuid) {
            var req = this.requests.get(uuid);
            return req.xhr;
        }
    },
    launch: {
        value: function(request) {
            if ("string" == typeof request) {
                var req = this.requests.get(request);
                return this.logger && this.logger.info("Launching a HTTP request...", req), req.xhr.send(req.data), 
                req.uuid;
            }
            return this.launch(this.prepare(request));
        }
    },
    listener: {
        value: function(event) {
            if (event.target.readyState === event.target.DONE && this.requests.has(event.target.UUID)) {
                var response, request = this.requests.get(event.target.UUID), lstn = request.obj.getListener(), headers = this.parser.parse(event.target.getAllResponseHeaders());
                response = void 0 !== headers["Content-Type"] && -1 !== headers["Content-Type"].indexOf("application/json") && "json" === request.obj.getType() ? new Sy.HTTP.JSONResponse() : void 0 !== headers["Content-Type"] && -1 !== headers["Content-Type"].indexOf("text/html") && "html" === request.obj.getType() ? new Sy.HTTP.HTMLResponse() : new Sy.HTTP.Response(), 
                response.setHeaders(headers), response.setStatusCode(event.target.status), response.setStatusText(event.target.statusText), 
                response.setBody(event.target.response), this.requests.remove(event.target.UUID), 
                lstn instanceof Function && (this.logger && this.logger.info("Notifying the request is finished...", response), 
                lstn(response));
            }
        }
    },
    abort: {
        value: function(identifier) {
            var request = this.requests.get(identifier);
            return request.xhr.abort(), this.requests.remove(identifier), this.logger && this.logger.info("HTTP request aborted", identifier), 
            this;
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
}), namespace("Sy.Lib.Generator"), Sy.Lib.Generator.Interface = function() {}, Sy.Lib.Generator.Interface.prototype = Object.create(Object.prototype, {
    generate: {
        value: function() {}
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
}), namespace("Sy.Storage.Event"), Sy.Storage.Event.LifecycleEvent = function(storageName, storeName, identifier, object) {
    this.storageName = storageName, this.storeName = storeName, this.identifier = identifier, 
    this.object = object;
}, Sy.Storage.Event.LifecycleEvent.prototype = Object.create(Object.prototype, {
    PRE_CREATE: {
        value: "storage::on::pre::create",
        writable: !1
    },
    POST_CREATE: {
        value: "storage::on::post::create",
        writable: !1
    },
    PRE_UPDATE: {
        value: "storage::on::pre:update",
        writable: !1
    },
    POST_UPDATE: {
        value: "storage::on::post::update",
        writable: !1
    },
    PRE_REMOVE: {
        value: "storage::on::pre::remove",
        writable: !1
    },
    POST_REMOVE: {
        value: "storage::on::post::remove",
        writable: !1
    },
    getStorageName: {
        value: function() {
            return this.storageName;
        }
    },
    getStoreName: {
        value: function() {
            return this.storeName;
        }
    },
    getIdentifier: {
        value: function() {
            return this.identifier;
        }
    },
    getData: {
        value: function() {
            return this.object;
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
                }.bind(this)), request.addEventListener("error", function(event) {
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
            var store = this.stores[storeName], evt = new Sy.Storage.Event.LifecycleEvent(this.name, storeName, null, object);
            try {
                this.mediator.publish(evt.PRE_CREATE, evt);
                var transaction = this.storage.transaction([ store.path ], this.transactionModes.READ_WRITE), objectStore = transaction.objectStore(store.path), request = objectStore.put(object);
                request.addEventListener("success", function(event) {
                    callback(event.target.result), this.mediator.publish(evt.POST_CREATE, evt);
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
            var store = this.stores[storeName], evt = new Sy.Storage.Event.LifecycleEvent(this.name, storeName, identifier, object);
            try {
                this.mediator.publish(evt.PRE_UPDATE, evt);
                var transaction = this.storage.transaction([ store.path ], this.transactionModes.READ_WRITE), objectStore = transaction.objectStore(store.path), request = objectStore.put(object);
                request.addEventListener("success", function(event) {
                    callback(event.target.result), this.mediator.publish(evt.POST_UPDATE, evt);
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
            var store = this.stores[storeName], evt = new Sy.Storage.Event.LifecycleEvent(this.name, storeName, identifier, null);
            try {
                this.mediator.publish(evt.PRE_REMOVE, evt);
                var transaction = this.storage.transaction([ store.path ], this.transactionModes.READ_WRITE), objectStore = transaction.objectStore(store.path), request = objectStore.delete(identifier);
                request.addEventListener("success", function(event) {
                    callback(event.target.result), this.mediator.publish(evt.POST_REMOVE, evt);
                }.bind(this)), request.addEventListener("error", function(event) {
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
            var store = this.stores[storeName], key = store.key, evt = new Sy.Storage.Event.LifecycleEvent(this.storageKey, storeName, null, object);
            return this.mediator.publish(evt.PRE_CREATE, evt), this.data[store.path][object[key]] = object, 
            this.flush(), this.mediator.publish(evt.POST_CREATE, evt), setTimeout(callback, 0, object[key]), 
            this;
        }
    },
    update: {
        value: function(storeName, identifier, object, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var store = this.stores[storeName], evt = new Sy.Storage.Event.LifecycleEvent(this.storageKey, storeName, identifier, object);
            return this.mediator.publish(evt.PRE_UPDATE, evt), this.data[store.path][identifier] = object, 
            this.flush(), this.mediator.publish(evt.POST_UPDATE, evt), setTimeout(callback, 0, object), 
            this;
        }
    },
    remove: {
        value: function(storeName, identifier, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var store = this.stores[storeName], evt = (store.key, new Sy.Storage.Event.LifecycleEvent(this.storageKey, storeName, identifier, null));
            return this.mediator.publish(evt.PRE_REMOVE, evt), delete this.data[store.path][identifier], 
            this.flush(), this.mediator.publish(evt.POST_REMOVE, evt), setTimeout(callback, 0, identifier), 
            this;
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
    this.mediator = null, this.headers = {}, this.name = "app::storage";
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
            var meta = this.stores[storeName], evt = new Sy.Storage.Event.LifecycleEvent(this.name, storeName, null, object);
            return this.mediator.publish(evt.PRE_CREATE, evt), this.manager.post({
                uri: this.basePath.replace(/{{path}}/, meta.path).replace(/{{key}}/, ""),
                headers: this.headers,
                data: object,
                listener: function(resp) {
                    callback(resp.getBody()), this.mediator.publish(evt.POST_CREATE, evt);
                }.bind(this)
            }), this;
        }
    },
    update: {
        value: function(storeName, identifier, object, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var meta = this.stores[storeName], evt = new Sy.Storage.Event.LifecycleEvent(this.name, storeName, identifier, object);
            return this.mediator.publish(evt.PRE_UPDATE, evt), this.manager.put({
                uri: this.basePath.replace(/{{path}}/, meta.path).replace(/{{key}}/, identifier),
                headers: this.headers,
                data: object,
                listener: function(resp) {
                    callback(resp.getBody()), this.mediator.publish(evt.POST_UPDATE, evt);
                }.bind(this)
            }), this;
        }
    },
    remove: {
        value: function(storeName, identifier, callback) {
            if (!this.stores[storeName]) throw new ReferenceError("Unknown store");
            var meta = this.stores[storeName], evt = new Sy.Storage.Event.LifecycleEvent(this.name, storeName, identifier, null);
            return this.mediator.publish(evt.PRE_REMOVE, evt), this.manager.remove({
                uri: this.basePath.replace(/{{path}}/, meta.path).replace(/{{key}}/, identifier),
                headers: this.headers,
                listener: function() {
                    callback(identifier), this.mediator.publish(evt.POST_REMOVE, evt);
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
            return this.uow.commit(), this;
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
    commit: {
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
});