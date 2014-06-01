namespace('Sy.Validator.Constraint');

/**
 * GreaterThan constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.GreaterThanValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.GreaterThanValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.GreaterThan)) {
                throw new TypeError('Invalid constraint');
            }

            if (value <= constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
