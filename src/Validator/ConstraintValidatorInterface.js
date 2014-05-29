namespace('Sy.Validator');

/**
 * Interface that eachconstraint validator must implement
 *
 * @package Sy
 * @subpackage Validator
 * @interface
 */

Sy.Validator.ConstraintValidatorInterface = function () {};
Sy.Validator.ConstraintValidatorInterface.prototype = Object.create(Object.prototype, {

    /**
     * Inject the current validation context
     *
     * @param {Sy.Validator.ExecutionContextInterface} context
     *
     * @return {Sy.Validator.ConstraintValidatorInterface} self
     */

    setContext: {
        value: function (context) {}
    },

    /**
     * Validate a value
     *
     * @param {mixed} value
     * @param {Sy.Validator.ConstraintInterface} constraint
     */

    validate: {
        value: function (value, constraint) {}
    }

});
