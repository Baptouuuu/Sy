namespace('Sy.Validator.Constraint');

/**
 * False constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.FalseValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.FalseValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.False)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== false) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
