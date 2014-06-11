namespace('Sy.Validator.Constraint');

/**
 * LessThan constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LessThanValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LessThanValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.LessThan)) {
                throw new TypeError('Invalid constraint');
            }

            if (value >= constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
