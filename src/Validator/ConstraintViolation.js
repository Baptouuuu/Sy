namespace('Sy.Validator');

/**
 * Holds message and path of a constraint violation
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ConstraintViolation = function (data) {
    this.message = data.message;
    this.path = data.path;
};
Sy.Validator.ConstraintViolation.prototype = Object.create(Object.prototype, {

    /**
     * Return the violation message
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.message;
        }
    },

    /**
     * Return the violation path
     *
     * @return {String}
     */

    getPath: {
        value: function () {
            return this.path;
        }
    },

    /**
     * Return raw object containing message + path
     *
     * @return {Object}
     */

    toJSON: {
        value: function () {
            return {
                message: this.message,
                path: this.path
            }
        }
    }

});
