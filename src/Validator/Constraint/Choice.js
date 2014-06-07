namespace('Sy.Validator.Constraint');

/**
 * Check that the value is one of the defined choices
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Choice = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.choices = options.choices || [];
    this.multiple = !!options.multiple;
    this.min = parseInt(options.min, 10);
    this.max = parseInt(options.max, 10);
    this.message = options.message || 'The value you selected is not a valid choice';
    this.multipleMessage = options.multipleMessage || 'One or more of the given values is invalid';
    this.minMessage = options.minMessage || 'You must select more choices';
    this.maxMessage = options.maxMessage || 'You have selected too many choices';
    this.callback = options.callback;
};
Sy.Validator.Constraint.Choice.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.ChoiceValidator';
        }
    },

    /**
     * Return the choices array
     *
     * @return {Array}
     */

    getChoices: {
        value: function () {
            return this.choices;
        }
    },

    /**
     * Check if the constraint has a function defined to get choices
     *
     * @return {Boolean}
     */

    hasCallback: {
        value: function () {
            return !!this.callback;
        }
    },

    /**
     * Return the callback to get choices
     *
     * @return {String}
     */

    getCallback: {
        value: function () {
            return this.callback;
        }
    },

    /**
     * Check if the value can contain numerous choices
     *
     * @return {Boolean}
     */

    isMultiple: {
        value: function () {
            return this.multiple;
        }
    },

    /**
     * Check if the constraint has a minimum of choices
     *
     * @return {Boolean}
     */

    hasMin: {
        value: function () {
            return !isNaN(this.min);
        }
    },

    /**
     * Return the minimum count of choices required
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Check if the constraint has a maximum of choices
     *
     * @return {Boolean}
     */

    hasMax: {
        value: function () {
            return !isNaN(this.max);
        }
    },

    /**
     * Return the maximum count of choices required
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    },

    /**
     * Return the error message if multiple choices allowed
     *
     * @return {String}
     */

    getMultipleMessage: {
        value: function () {
            return this.multipleMessage;
        }
    },

    /**
     * Return the error message if too few choices
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the error message if too many choices
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    }

});
