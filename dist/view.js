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
}), DOM = function(node) {
    return this === window ? new DOM(node) : void (this.node = node);
}, DOM.prototype = Object.create(Object.prototype, {
    isChildOf: {
        value: function(toMatch, node) {
            return node = node || this.node, toMatch instanceof HTMLElement ? toMatch === node ? !0 : this.isChildOf(toMatch, node.parentNode) : "string" == typeof toMatch ? this.matches(toMatch) ? !0 : this.matches(toMatch, node.parentNode) : !1;
        }
    },
    matches: {
        value: function(selector, node) {
            return node = node || this.node, node.matches && node.matches(selector) ? !0 : node.webkitMatchesSelector && node.webkitMatchesSelector(selector) ? !0 : node.mozMatchesSelector && node.mozMatchesSelector(selector) ? !0 : node.msMatchesSelector && node.msMatchesSelector(selector) ? !0 : !1;
        }
    }
}), namespace("Sy.View"), Sy.View.LayoutFactoryInterface = function() {}, Sy.View.LayoutFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setParser: {
        value: function() {}
    },
    setTemplateEngine: {
        value: function() {}
    },
    setRegistryFactory: {
        value: function() {}
    },
    setListFactory: {
        value: function() {}
    }
}), namespace("Sy.View"), Sy.View.ListFactoryInterface = function() {}, Sy.View.ListFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setTemplateEngine: {
        value: function() {}
    }
}), namespace("Sy.View"), Sy.View.TemplateEngineInterface = function() {}, Sy.View.TemplateEngineInterface.prototype = Object.create(Object.prototype, {
    PATTERN: {
        value: new RegExp(/{{\s?([\w.]+)\s?}}/gim),
        writable: !1,
        configurable: !1
    },
    render: {
        value: function() {}
    }
}), namespace("Sy.View"), Sy.View.ViewScreenFactoryInterface = function() {}, Sy.View.ViewScreenFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setParser: {
        value: function() {}
    },
    setTemplateEngine: {
        value: function() {}
    },
    setRegistryFactory: {
        value: function() {}
    },
    setLayoutFactory: {
        value: function() {}
    },
    setViewScreenWrapper: {
        value: function() {}
    }
}), namespace("Sy.View.Event"), Sy.View.Event.ViewPortEvent = function(viewscreen) {
    if (!(viewscreen instanceof Sy.View.ViewScreen)) throw new TypeError("Invalid viewscreen");
    this.viewscreen = viewscreen;
}, Sy.View.Event.ViewPortEvent.prototype = Object.create(Object.prototype, {
    PRE_DISPLAY: {
        value: "view::on::pre::display",
        writable: !1
    },
    POST_DISPLAY: {
        value: "view::on::post::display",
        writable: !1
    },
    getViewScreen: {
        value: function() {
            return this.viewscreen;
        }
    }
}), namespace("Sy.View"), Sy.View.NodeWrapper = function() {
    this.engine = null, this.node = null;
}, Sy.View.NodeWrapper.prototype = Object.create(Object.prototype, {
    setTemplateEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.View.TemplateEngineInterface)) throw new TypeError("Invalid template engine");
            return this.engine = engine, this;
        }
    },
    setNode: {
        value: function(node) {
            if (!(node instanceof HTMLElement)) throw new TypeError("Invalid dom node");
            return this.node = node, this;
        }
    },
    getNode: {
        value: function() {
            return this.node;
        }
    },
    render: {
        value: function(data) {
            return this.engine.render(this.node, data), this;
        }
    },
    findOne: {
        value: function(selector) {
            return this.node.querySelector(selector);
        }
    },
    find: {
        value: function(selector) {
            return this.node.querySelectorAll(selector);
        }
    }
}), namespace("Sy.View"), Sy.View.Layout = function() {
    Sy.View.NodeWrapper.call(this), this.name = null, this.lists = null, this.parser = null, 
    this.listFactory = null;
}, Sy.View.Layout.prototype = Object.create(Sy.View.NodeWrapper.prototype, {
    setNode: {
        value: function(node) {
            var lists, wrapper;
            Sy.View.NodeWrapper.prototype.setNode.call(this, node), this.name = node.dataset.syLayout, 
            lists = this.parser.getLists(node);
            for (var i = 0, l = lists.length; l > i; i++) wrapper = this.listFactory.make(lists[i]), 
            this.lists.set(wrapper.getName(), wrapper);
            return this;
        }
    },
    getName: {
        value: function() {
            return this.name;
        }
    },
    setParser: {
        value: function(parser) {
            if (!(parser instanceof Sy.View.Parser)) throw new TypeError("Invalid parser");
            return this.parser = parser, this;
        }
    },
    setListsRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.lists = registry, this;
        }
    },
    setListFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.View.ListFactoryInterface)) throw new TypeError("Invalid list factory");
            return this.listFactory = factory, this;
        }
    },
    getLists: {
        value: function() {
            return this.lists.get();
        }
    },
    getList: {
        value: function(name) {
            return this.lists.get(name);
        }
    }
}), namespace("Sy.View"), Sy.View.LayoutFactory = function() {
    this.parser = null, this.engine = null, this.registryFactory = null, this.listFactory = null;
}, Sy.View.LayoutFactory.prototype = Object.create(Sy.View.LayoutFactoryInterface.prototype, {
    setParser: {
        value: function(parser) {
            if (!(parser instanceof Sy.View.Parser)) throw new TypeError("Invalid parser");
            return this.parser = parser, this;
        }
    },
    setTemplateEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.View.TemplateEngineInterface)) throw new TypeError("Invalid template engine");
            return this.engine = engine, this;
        }
    },
    setRegistryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.RegistryFactory)) throw new TypeError("Invalid registry factory");
            return this.registryFactory = factory, this;
        }
    },
    setListFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.View.ListFactoryInterface)) throw new TypeError("Invalid list factory");
            return this.listFactory = factory, this;
        }
    },
    make: {
        value: function(node) {
            var wrapper = new Sy.View.Layout();
            return wrapper.setParser(this.parser).setListFactory(this.listFactory).setListsRegistry(this.registryFactory.make()).setTemplateEngine(this.engine).setNode(node);
        }
    }
}), namespace("Sy.View"), Sy.View.List = function() {
    Sy.View.NodeWrapper.call(this), this.name = null, this.elements = [], this.types = [];
}, Sy.View.List.prototype = Object.create(Sy.View.NodeWrapper.prototype, {
    setNode: {
        value: function(node) {
            var child;
            Sy.View.NodeWrapper.prototype.setNode.call(this, node), this.name = node.dataset.syList;
            for (var i = 0, l = node.childElementCount; l > i; i++) {
                if (child = node.firstElementChild, this.elements.push(child), node.removeChild(child), 
                this.elements.length > 1 && void 0 === child.dataset.type) throw new SyntaxError("Multiple list elements require a type to be set");
                if (void 0 !== child.dataset.type) {
                    if (-1 !== this.types.indexOf(child.dataset.type)) throw new SyntaxError("Multiple list elements defined with the same type");
                    this.types.push(child.dataset.type);
                }
            }
            return this;
        }
    },
    getName: {
        value: function() {
            return this.name;
        }
    },
    renderElement: {
        value: function(data, type) {
            var node, idx = type ? this.types.indexOf(type) : 0;
            if (-1 === idx) throw new ReferenceError('The type "' + type + '" does not exist for the list "' + this.getName() + '"');
            return node = this.elements[idx].cloneNode(!0), this.engine.render(node, data);
        }
    },
    append: {
        value: function(data, type) {
            return this.getNode().appendChild(this.renderElement(data, type)), this;
        }
    },
    prepend: {
        value: function(data, type) {
            return this.getNode().insertBefore(this.renderElement(data, type), this.getNode().firstElementChild), 
            this;
        }
    },
    render: {
        value: function(data) {
            for (var d, type, node = this.getNode(); node.firstElementChild; ) node.removeChild(node.firstElementChild);
            for (var j = 0, jl = data.length; jl > j; j++) d = data[j], type = d._type, this.append(d, type);
            return this;
        }
    }
}), namespace("Sy.View"), Sy.View.ListFactory = function() {
    this.engine = null;
}, Sy.View.ListFactory.prototype = Object.create(Sy.View.ListFactoryInterface.prototype, {
    setTemplateEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.View.TemplateEngineInterface)) throw new TypeError("Invalid template engine");
            return this.engine = engine, this;
        }
    },
    make: {
        value: function(node) {
            var wrapper = new Sy.View.List();
            return wrapper.setTemplateEngine(this.engine).setNode(node);
        }
    }
}), namespace("Sy.View"), Sy.View.Manager = function() {
    this.views = null, this.factory = null;
}, Sy.View.Manager.prototype = Object.create(Object.prototype, {
    setViewsRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.views = registry, this;
        }
    },
    setViewScreenFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.View.ViewScreenFactoryInterface)) throw new TypeError("Invalid factory");
            return this.factory = factory, this;
        }
    },
    setViewScreen: {
        value: function(node) {
            if (!(node instanceof HTMLElement)) throw new TypeError("Html node expected");
            var name = node.dataset.syView;
            if (!name && "" === name.trim()) throw new SyntaxError('Attribute "data-sy-view" is expected');
            if (this.views.has(name.trim())) throw new ReferenceError('A view with the name "' + name.trim() + '"');
            return this.views.set(name.trim(), this.factory.make(node)), this;
        }
    },
    getViewScreen: {
        value: function(name) {
            if (!this.views.has(name)) throw new ReferenceError('The view screen "' + name + '" is not registered');
            return this.views.get(name);
        }
    },
    getViewScreens: {
        value: function() {
            return this.views.get();
        }
    }
}), namespace("Sy.View"), Sy.View.Parser = function() {}, Sy.View.Parser.prototype = Object.create(Object.prototype, {
    get: {
        value: function(selector, node) {
            return node = node || document.body, node.querySelectorAll(selector);
        }
    },
    getViewScreens: {
        value: function(node) {
            return this.get("[data-sy-view]", node);
        }
    },
    getLayouts: {
        value: function(node) {
            return this.get("[data-sy-layout]", node);
        }
    },
    getLists: {
        value: function(node) {
            return this.get("[data-sy-list]", node);
        }
    }
}), namespace("Sy.View"), Sy.View.TemplateEngine = function() {
    Sy.View.TemplateEngineInterface.call(this), this.registry = null, this.generator = null;
}, Sy.View.TemplateEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype, {
    setRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.registry = registry, this;
        }
    },
    setGenerator: {
        value: function(generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) throw new TypeError("Invalid generator");
            return this.generator = generator, this;
        }
    },
    render: {
        value: function(node, data) {
            if (node.dataset.syUuid || this.register(node), node.dataset.syUuid && this.registry.has(node.dataset.syUuid) && (this.renderAllAttributes(node, data), 
            this.renderContent(node, data)), node.childElementCount > 0) for (var i = 0, l = node.childElementCount; l > i; i++) this.render(node.children[i], data);
            return node;
        }
    },
    register: {
        value: function(node) {
            for (var uuid = this.generator.generate(), content = {
                attributes: {},
                textContent: null,
                uuid: uuid
            }, i = 0, l = node.attributes.length; l > i; i++) content.attributes[node.attributes[i].name] = node.getAttribute(node.attributes[i].name);
            return content.textContent = node.textContent, node.dataset.syUuid = uuid, this.registry.set(uuid, content), 
            this;
        }
    },
    renderAllAttributes: {
        value: function(node, data) {
            for (var i = 0, l = node.attributes.length; l > i; i++) this.renderAttribute(node, node.attributes[i].name, data);
            return node;
        }
    },
    renderAttribute: {
        value: function(node, attribute, data) {
            var text, uuid = node.dataset.syUuid, originalContent = this.registry.get(uuid).attributes[attribute];
            return originalContent ? (text = this.replace(originalContent, data), node.setAttribute(attribute, text), 
            node) : node;
        }
    },
    replace: {
        value: function(source, data) {
            for (;source.match(this.PATTERN); ) {
                var results = this.PATTERN.exec(source);
                null !== results && results.length >= 1 && (source = source.replace(results[0], reflectedObjectGetter.call(data, results[1]) || ""));
            }
            return source;
        }
    },
    renderContent: {
        value: function(node, data) {
            if (node.childElementCount > 0) return node;
            var d, uuid = node.dataset.syUuid, originalContent = this.registry.get(uuid).textContent, results = this.PATTERN.exec(originalContent);
            return results && (d = objectGetter.call(data, results[1])), d instanceof HTMLElement ? (node.removeChild(node.firstElementChild), 
            node.appendChild(d)) : node.textContent = this.replace(originalContent, data), node;
        }
    }
}), namespace("Sy.View"), Sy.View.ViewPort = function() {
    this.node = null, this.manager = null, this.mediator = null, this.current = null;
}, Sy.View.ViewPort.prototype = Object.create(Sy.View.NodeWrapper.prototype, {
    setMediator: {
        value: function(mediator) {
            if (!(mediator instanceof Sy.Lib.Mediator)) throw new TypeError("Invalid mediator");
            return this.mediator = mediator, this;
        }
    },
    setNode: {
        value: function(node) {
            if (!(node instanceof HTMLElement && node.classList.contains("viewport"))) throw new TypeError("Invalid node");
            return this.node = node, this;
        }
    },
    setViewManager: {
        value: function(manager) {
            if (!(manager instanceof Sy.View.Manager)) throw new TypeError("Invalid manager");
            return this.manager = manager, this;
        }
    },
    getViewManager: {
        value: function() {
            return this.manager;
        }
    },
    getCurrentViewScreen: {
        value: function() {
            return null === this.current && 1 === this.node.childElementCount && (this.current = this.manager.getViewScreen(this.node.firstElementChild.dataset.syView)), 
            this.current;
        }
    },
    display: {
        value: function(name) {
            var viewscreen = this.manager.getViewScreen(name), node = viewscreen.getNode(), event = new Sy.View.Event.ViewPortEvent(viewscreen);
            switch (this.mediator && this.mediator.publish(event.PRE_DISPLAY, event), this.node.childElementCount) {
              case 0:
                this.node.appendChild(node);
                break;

              case 1:
                this.node.replaceChild(node, this.node.children[0]);
                break;

              default:
                throw new Error("Viewport in weird state (more than 1 child)");
            }
            return this.current = viewscreen, this.mediator && this.mediator.publish(event.POST_DISPLAY, event), 
            this;
        }
    }
}), namespace("Sy.View"), Sy.View.ViewScreen = function() {
    Sy.View.NodeWrapper.call(this), this.name = "", this.parser = null, this.layouts = null, 
    this.layoutFactory = null;
}, Sy.View.ViewScreen.prototype = Object.create(Sy.View.NodeWrapper.prototype, {
    setNode: {
        value: function(node) {
            var layouts, wrapper;
            Sy.View.NodeWrapper.prototype.setNode.call(this, node), this.name = node.dataset.syView, 
            layouts = this.parser.getLayouts(node);
            for (var i = 0, l = layouts.length; l > i; i++) wrapper = this.layoutFactory.make(layouts[i]), 
            this.layouts.set(wrapper.getName(), wrapper);
            return this;
        }
    },
    getName: {
        value: function() {
            return this.name;
        }
    },
    setParser: {
        value: function(parser) {
            if (!(parser instanceof Sy.View.Parser)) throw new TypeError("Invalid parser");
            return this.parser = parser, this;
        }
    },
    setLayoutsRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.layouts = registry, this;
        }
    },
    setLayoutFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.View.LayoutFactoryInterface)) throw new TypeError("Invalid layout factory");
            return this.layoutFactory = factory, this;
        }
    },
    getLayouts: {
        value: function() {
            return this.layouts.get();
        }
    },
    getLayout: {
        value: function(name) {
            return this.layouts.get(name);
        }
    }
}), namespace("Sy.View"), Sy.View.ViewScreenFactory = function() {
    this.parser = null, this.engine = null, this.registryFactory = null, this.layoutFactory = null, 
    this.viewscreens = null;
}, Sy.View.ViewScreenFactory.prototype = Object.create(Sy.View.ViewScreenFactoryInterface.prototype, {
    setParser: {
        value: function(parser) {
            if (!(parser instanceof Sy.View.Parser)) throw new TypeError("Invalid parser");
            return this.parser = parser, this;
        }
    },
    setTemplateEngine: {
        value: function(engine) {
            if (!(engine instanceof Sy.View.TemplateEngineInterface)) throw new TypeError("Invalid template engine");
            return this.engine = engine, this;
        }
    },
    setRegistryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.RegistryFactory)) throw new TypeError("Invalid registry factory");
            return this.registryFactory = factory, this.viewscreens = factory.make(), this;
        }
    },
    setLayoutFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.View.LayoutFactoryInterface)) throw new TypeError("Invalid layout factory");
            return this.layoutFactory = factory, this;
        }
    },
    setViewScreenWrapper: {
        value: function(name, viewscreenConstructor) {
            if (this.viewscreens.has(name)) throw new ReferenceError('A viewscreen wrapper is already defined with the name "' + name + '"');
            return this.viewscreens.set(name, viewscreenConstructor), this;
        }
    },
    setDefinedWrappers: {
        value: function(wrappers) {
            for (var i = 0, l = wrappers.length; l > i; i++) this.setViewScreenWrapper(wrappers[i].name, wrappers[i].creator);
            return this;
        }
    },
    make: {
        value: function(node) {
            var wrapper, name = node.dataset.syView;
            if (wrapper = this.viewscreens.has(name) ? new (this.viewscreens.get(name))() : new Sy.View.ViewScreen(), 
            !(wrapper instanceof Sy.View.ViewScreen)) throw new TypeError("Invalid viewscreen wrapper");
            return wrapper.setParser(this.parser).setLayoutFactory(this.layoutFactory).setLayoutsRegistry(this.registryFactory.make()).setTemplateEngine(this.engine).setNode(node);
        }
    }
});