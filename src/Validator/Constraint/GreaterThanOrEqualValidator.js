namespace('Sy.Validator.Constraint');

/**
 * GreaterThanOrEqual constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.GreaterThanOrEqualValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.GreaterThanOrEqualValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.GreaterThanOrEqual)) {
                throw new TypeError('Invalid constraint');
            }

            if (value < constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
