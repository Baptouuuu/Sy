namespace('Sy.Validator.Constraint');

/**
 * Check that a value has a length between the specified min and max
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Length = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.min = options.min;
    this.max = options.max;
    this.minMessage = options.minMessage || 'The value is too short';
    this.maxMessage = options.maxMessage || 'The value is too long';
    this.exactMessage = options.exactMessage || 'The value must be ' + this.min + ' long';
};
Sy.Validator.Constraint.Length.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.LengthValidator';
        }
    },

    /**
     * Get the minimum length
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Return the maximum length
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the error message if value too short
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the error message if value too long
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    },

    /**
     * Return the error message in case min is equal to max, and the value differs from it
     *
     * @return {String}
     */

    getExactMessage: {
        value: function () {
            return this.exactMessage;
        }
    }

});
