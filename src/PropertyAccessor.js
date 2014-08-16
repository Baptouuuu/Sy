namespace('Sy');

/**
 * Tool to easily retrieve/set data of a particular path in an object graph
 *
 * @package Sy
 * @class
 */

Sy.PropertyAccessor = function (disableGetterSetter) {
    this.disableGetterSetter = !!disableGetterSetter;
    this.prefixes = ['get', 'is', 'has'];
};

Sy.PropertyAccessor.prototype = Object.create(Object.prototype, {

    /**
     * Return the value for the given object path
     *
     * @param {Object} object Path root
     * @param {String|Array} path
     *
     * @throws {ReferenceError} If the path is not reachable
     *
     * @return {mixed}
     */

    getValue: {
        value: function (object, path) {
            var elements = this.transform(path),
                prop = elements.shift(),
                refl = new ReflectionObject(object),
                fromGetter = false,
                value,
                method;

            if (!this.disableGetterSetter) {
                for (var i = 0, l = this.prefixes.length; i < l; i++) {
                    method = this.prefixes[i] + this.camelize(prop);

                    if (refl.hasMethod(method)) {
                        value = refl.getMethod(method).call();
                        fromGetter = true;
                        break;
                    }
                }
            }

            if (!fromGetter && refl.hasProperty(prop)) {
                value = refl.getProperty(prop).getValue();
            } else if (!fromGetter) {
                throw new ReferenceError('Path not accessible');
            }

            if (elements.length === 0) {
                return value;
            }

            return this.getValue(value, elements);
        }
    },

    /**
     * Access the specified path in the object and change the value to the one specified
     *
     * @param {Object} object
     * @param {String} path
     * @param {mixed} value
     *
     * @return {Sy.PropertyAccessor} self
     */

    setValue: {
        value: function (object, path, value) {
            var elements = this.transform(path),
                prop = elements.pop(),
                refl,
                method;

            if (elements.length !== 0) {
                object = this.getValue(object, elements);
            }

            if (!this.disableGetterSetter) {
                method = 'set' + this.camelize(prop);
                refl = new ReflectionObject(object);

                if (refl.hasMethod(method)) {
                    refl.getMethod(method).call(value);
                    return this;
                }
            }

            object[prop] = value;

            return this;
        }
    },

    /**
     * Transform a path string into an array of its elements
     *
     * @param {String|Array} path
     *
     * @return {Array}
     */

    transform: {
        value: function (path) {
            if (path instanceof Array) {
                return path;
            }

            if (typeof path !== 'string' || path.trim() === '') {
                throw new TypeError('Invalid path');
            }

            return path.split('.');
        }
    },

    /**
     * Camelize a string
     *
     * @param {String} string
     *
     * @return {String}
     */

    camelize: {
        value: function (string) {
            var pieces = string.split('_');

            pieces.forEach(function (el, id) {
                this[id] = el.substr(0, 1).toUpperCase() + el.substr(1);
            }, pieces);

            return pieces.join('');
        }
    },

    /**
     * Activate the use of getters/setters
     *
     * @return {Sy.PropertyAccessor} self
     */

    enableSetterGetter: {
        value: function () {
            this.disableGetterSetter = false;

            return this;
        }
    },

    /**
     * Deactivate the use of getters/setters
     *
     * @return {Sy.PropertyAccessor} self
     */

    disableSetterGetter: {
        value: function () {
            this.disableGetterSetter = true;

            return this;
        }
    },

    /**
     * Check if a path is accessible
     *
     * @param {Object} object
     * @param {String} path
     *
     * @return {Boolean}
     */

    isReadable: {
        value: function (object, path) {
            try {
                this.getValue(object, path);
                return true;
            } catch (e) {
                return false;
            }
        }
    }

});
