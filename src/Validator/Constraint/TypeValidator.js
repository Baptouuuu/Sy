namespace('Sy.Validator.Constraint');

/**
 * Type constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.TypeValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.TypeValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Type)) {
                throw new TypeError('Invalid constraint');
            }

            var expected = constraint.getType();

            if (
                typeof value !== expected &&
                !(value instanceof objectGetter(expected))
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
