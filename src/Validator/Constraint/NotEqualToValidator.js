namespace('Sy.Validator.Constraint');

/**
 * NotEqualTo constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotEqualToValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotEqualToValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotEqualTo)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
