namespace('Sy.Validator');

/**
 * Interface to declare required constraint methods
 *
 * @package Sy
 * @subpackage Validator
 * @interface
 */

Sy.Validator.ConstraintInterface = function (options) {};
Sy.Validator.ConstraintInterface.prototype = Object.create(Object.prototype, {

    /**
     * Check if the given validation group is set for the constraint
     *
     * @param {String} group
     *
     * @return {Boolean}
     */

    hasGroup: {
        value: function (group) {}
    },

    /**
     * Return the path to the constraint validator class
     *
     * @return {String}
     */

    validateBy: {
        value: function () {}
    }

});
