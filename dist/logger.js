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
});