namespace('Sy.Validator.Constraint');

/**
 * Length constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LengthValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LengthValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Length)) {
                throw new TypeError('Invalid constraint');
            }

            if (value.length === undefined) {
                throw new TypeError('The value has no length attribute');
            }

            if (
                constraint.getMin() === constraint.getMax() &&
                value.length !== constraint.getMin()
            ) {
                this.context.addViolation(constraint.getExactMessage());
            } else {

                if (value.length < constraint.getMin()) {
                    this.context.addViolation(constraint.getMinMessage());
                }

                if (value.length > constraint.getMax()) {
                    this.context.addViolation(constraint.getMaxMessage());
                }

            }

        }
    }

});
