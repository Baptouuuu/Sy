namespace('Sy.Validator');

/**
 * Holds a set of contraint violations messages
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ConstraintViolationList = function () {
    this.violations = [];
    this.length = 0;
};
Sy.Validator.ConstraintViolationList.prototype = Object.create(Object.prototype, {

    /**
     * Add a new violation
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    addViolation: {
        value: function (message) {
            this.violations.push(new Sy.Validator.ConstraintViolation({
                message: message
            }));
            this.length++;

            return this;
        }
    },

    /**
     * Add a new violation for the specified path
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    addViolationAt: {
        value: function (path, message) {
            this.violations.push(new Sy.Validator.ConstraintViolation({
                message: message,
                path: path
            }));
            this.length++;

            return this;
        }
    },

    /**
     * Apply a callback on each violations
     *
     * @param {Function} callback
     *
     * @return {Sy.Validator.ConstraintViolationList} self
     */

    forEach: {
        value: function (callback) {
            this.violations.forEach(callback);

            return this;
        }
    },

    /**
     * Return all the violations
     *
     * @return {Array}
     */

    getViolations: {
        value: function () {
            return this.violations;
        }
    },

    /**
     * Return the violations for the specified type
     *
     * @return {Array}
     */

    getViolationsAt: {
        value: function (path) {
            return this.violations.filter(function (violation) {
                return violation.getPath() === path;
            }.bind(this));
        }
    },

    /**
     * Return an array of raw representation of each violation
     *
     * @return {Array}
     */

    toJSON: {
        value: function () {
            return this.violations.map(function (element) {
                return element.toJSON();
            });
        }
    }

});
