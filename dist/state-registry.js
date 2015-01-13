/*! sy#1.2.0 - 2015-01-13 */
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
    },

    /**
     * Set the registry as strict, meaning a key can only exist in one state
     *
     * @return {Sy.StateRegistryInterface}
     */

    setStrict: {
        value: function () {}
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
    this.strict = false;
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

            if (this.strict === true) {
                var oldState = this.state(key);

                if (oldState !== undefined) {
                    this.remove(oldState, key);
                }
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
    },

    /**
     * @inheritDoc
     */

    setStrict: {
        value: function () {
            this.strict = true;

            return this;
        }
    },

    /**
     * Return all the states having at least one value
     *
     * @return {Array}
     */

    getStates: {
        value: function () {
            var states = [];

            for (var i = 0, l = this.states.length; i < l; i++) {
                if (this.data.get(this.states[i]).get().length > 0) {
                    states.push(this.states[i]);
                }
            }

            return states;
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