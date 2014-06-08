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

namespace("Sy"), Sy.ServiceContainerInterface = function() {}, Sy.ServiceContainerInterface.prototype = Object.create(Object.prototype, {
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
});