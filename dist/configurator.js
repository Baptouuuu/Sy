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
});