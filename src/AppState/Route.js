namespace('Sy.AppState');

/**
 * Represent a URL
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.Route = function () {
    this.name = null;
    this.path = null;
    this.parameters = {};
    this.requirements = {};
    this.regex = null;
};
Sy.AppState.Route.prototype = Object.create(Object.prototype, {

    /**
     * Set the route name
     *
     * @param {String} name
     *
     * @return {Sy.AppState.Route} self
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * Return the route name
     *
     * @return {String}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Set the path
     *
     * @param {String} path
     *
     * @return {Sy.AppState.Route} self
     */

    setPath: {
        value: function (path) {
            this.path = path;

            return this;
        }
    },

    /**
     * Return the path
     *
     * @return {String}
     */

    getPath: {
        value: function () {
            return this.path;
        }
    },

    /**
     * Set the parameters
     *
     * @param {Object} params
     *
     * @return {Sy.AppState.Route} self
     */

    setParameters: {
        value: function (params) {
            if (!Object.isFrozen(this.parameters)) {
                this.parameters = params;
            }

            Object.freeze(this.parameters);

            return this;
        }
    },

    /**
     * Get the parameters
     *
     * @return {Object}
     */

    getParameters: {
        value: function () {
            return this.parameters;
        }
    },

    /**
     * Set the requirements
     *
     * @param {Object} req
     *
     * @return {Sy.AppState.Route} self
     */

    setRequirements: {
        value: function (req) {
            if (!Object.isFrozen(this.requirements)) {
                this.requirements = req;
            }

            Object.freeze(this.requirements);

            return this;
        }
    },

    /**
     * Return the requirements
     *
     * @return {Object}
     */

    getRequirements: {
        value: function () {
            return this.requirements;
        }
    },

    /**
     * Return a requirement
     *
     * @param {String} name
     *
     * @return {mixed}
     */

    getRequirement: {
        value: function (name) {
            return this.requirements[name];
        }
    },

    /**
     * Check if the route has a requirement
     *
     * @param {String} name
     *
     * @return {Boolean}
     */

    hasRequirement: {
        value: function (name) {
            return this.requirements.hasOwnProperty(name);
        }
    },

    /**
     * Create a regex from the path and requirements
     *
     * @return {Sy.AppState.Route} self
     */

    buildRegex: {
        value: function () {
            var placeholders = this.path.match(new RegExp(/{\w+}/g));

            this.regex = '^' + this.path + '$';

            if (placeholders instanceof Array) {
                placeholders.forEach(function (placeholder) {
                    var name = placeholder.substring(1, placeholder.length - 1);

                    if (this.hasRequirement(name)) {
                        this.regex = this.regex.replace(
                            placeholder,
                            '(' + this.getRequirement(name) + ')'
                        );
                    } else {
                        this.regex = this.regex.replace(
                            placeholder,
                            '(.+)'
                        );
                    }
                }.bind(this));
            }

            return this;
        }
    },

    /**
     * Check if a string matches the url
     *
     * @param {String} url
     *
     * @return {Boolean}
     */

    matches: {
        value: function (url) {
            return (new RegExp(this.regex)).test(url);
        }
    },

    /**
     * Return the variables from the url
     *
     * @param {String} url
     *
     * @return {Object}
     */

    getVariables: {
        value: function (url) {
            var placeholders = this.path.match(new RegExp(/{\w+}/g)),
                values = url.match(new RegExp(this.regex)),
                data = {};

            placeholders = placeholders.map(function (p) {
                return p.substring(1, p.length - 1);
            });

            values = values.filter(function (val) {
                return val !== url;
            });

            for (var i = 0, l = placeholders.length; i < l; i++) {
                data[placeholders[i]] = values[i];
            }

            return data;
        }
    }

});