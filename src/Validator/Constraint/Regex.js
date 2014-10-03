namespace('Sy.Validator.Constraint');

/**
 * Check that a value match the given pattern
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Regex = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.pattern = options.pattern;
    this.flags = options.flags;
    this.message = options.message || 'The value do not match the wished pattern';
};
Sy.Validator.Constraint.Regex.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.RegexValidator';
        }
    },

    /**
     * Return the regular expression pattern
     *
     * @return {String}
     */

    getPattern: {
        value: function () {
            return this.pattern;
        }
    },

    /**
     * Return the regular expression flags
     *
     * @return {String}
     */

    getFlags: {
        value: function () {
            return this.flags;
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
    }

});
