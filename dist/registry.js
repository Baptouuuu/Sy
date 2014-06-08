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