namespace('Sy.Validator.Constraint');

/**
 * Check that a value is of the specified type
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Type = function (options) {
    Sy.Validator.AbstractConstraint.call(this, options);

    this.type = options.type;
    this.message = options.message || 'The value differs from the specified type';
};
Sy.Validator.Constraint.Type.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.TypeValidator';
        }
    },

    /**
     * Return the wished type
     *
     * @return {mixed}
     */

    getType: {
        value: function () {
            return this.type;
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
