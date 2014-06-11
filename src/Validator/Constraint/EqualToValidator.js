namespace('Sy.Validator.Constraint');

/**
 * EqualTo constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.EqualToValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.EqualToValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.EqualTo)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
