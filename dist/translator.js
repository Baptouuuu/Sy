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

namespace("Sy"), Sy.Translator = function() {
    this.currentLanguage = null, this.languages = null, this.stateRegistryFactory = null;
}, Sy.Translator.prototype = Object.create(Object.prototype, {
    setRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.Registry)) throw new TypeError("Invalid registry");
            return this.languages = registry, this;
        }
    },
    setStateRegistryFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.StateRegistryFactory)) throw new TypeError("Invalid state registry factory");
            return this.stateRegistryFactory = factory, this;
        }
    },
    setLanguage: {
        value: function(language) {
            return this.currentLanguage = language, this;
        }
    },
    registerTranslation: {
        value: function(language, domain, key, translation) {
            return this.languages.has(language) || this.languages.set(language, this.stateRegistryFactory.make()), 
            this.languages.get(language).set(domain, key, translation), this;
        }
    },
    registerTranslations: {
        value: function(language, translations) {
            for (var i = 0, l = translations.length; l > i; i++) this.registerTranslation(language, translations[i].domain || "root", translations[i].key, translations[i].translation);
            return this;
        }
    },
    translate: {
        value: function(key, domain, language) {
            var lang = language || this.currentLanguage;
            return domain = domain || "root", this.languages.has(lang) && this.languages.get(lang).has(domain, key) ? this.languages.get(lang).get(domain, key) : key;
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
});