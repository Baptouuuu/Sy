/*! sy#1.1.0 - 2014-12-20 */
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
 * Wrapper to set/retrieve key/value pairs
 *
 * @package Sy
 * @interface
 */

Sy.ConfiguratorInterface = function () {};

Sy.ConfiguratorInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a new key/value pair
     *
     * @param {string} key
     * @param {mixed} value
     *
     * @return {Sy.ConfiguratorInterface}
     */

    set: {
        value: function (key, value) {}
    },

    /**
     * Return a previously set value through its key
     *
     * @param {string} key
     *
     * @return {mixed}
     */

    get: {
        value: function (key) {}
    },

    /**
     * Check if a key is set in the configuration
     *
     * @param {string} key
     *
     * @return {boolean}
     */

    has: {
        value: function (key) {}
    },

    /**
     * Set a name for configuration object
     *
     * @param {string} name
     *
     * @return {Sy.ConfiguratorInterface}
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Return the configuration name
     *
     * @return {string}
     */

    getName: {
        value: function () {}
    }

});
namespace('Sy');

/**
 * Wrapper to set/retrieve key/value pairs
 *
 * @package Sy
 * @class
 * @implements {Sy.ConfiguratorInterface}
 */

Sy.Configurator = function () {

    this.name = '';
    this.config = {};

};

Sy.Configurator.prototype = Object.create(Sy.ConfiguratorInterface.prototype, {

    /**
     * @inheritDoc
     */

    set: {
        value: function (key, value) {

            if (key instanceof Object && value === undefined) {
                this.config = _.extend(this.config, key);
            } else {
                objectSetter.call(this.config, key, value);
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (key) {

            var value;

            if (key === undefined) {
                value = this.config;
            } else if (this.has(key)) {
                value = objectGetter.call(this.config, key);
            }

            return value;

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (key) {
            var elements = key.split('.'),
                object = this.config,
                prop;

            while (elements.length !== 0) {
                prop = elements.shift();

                if (!object.hasOwnProperty(prop)) {
                    return false;
                }

                object = object[prop];
            }

            return true;
        }
    },

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getName: {
        value: function () {

            return this.name;

        }
    }

});