namespace('Sy.Validator.Constraint');

/**
 * Check that a value is in the defined range
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Range = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.min = options.min;
    this.max = options.max;
    this.minMessage = options.minMessage || 'The value is below the lower bound';
    this.maxMessage = options.maxMessage || 'The value is above the upper bound';
};
Sy.Validator.Constraint.Range.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.RangeValidator';
        }
    },

    /**
     * Return the lower bound
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Return the upper bound
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the lower bound error message
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the upper bound error message
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    }

});
