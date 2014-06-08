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

namespace("Sy.Lib"), Sy.Lib.Mediator = function() {
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
});