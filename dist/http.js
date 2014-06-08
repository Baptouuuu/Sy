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

namespace("Sy.Lib.Logger"), Sy.Lib.Logger.Interface = function() {}, Sy.Lib.Logger.Interface.prototype = Object.create(Object.prototype, {
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
}), namespace("Sy"), Sy.FactoryInterface = function() {}, Sy.FactoryInterface.prototype = Object.create(Object.prototype, {
    make: {
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
});