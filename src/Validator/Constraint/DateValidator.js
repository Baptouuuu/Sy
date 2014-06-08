namespace('Sy.Validator.Constraint');

/**
 * Date constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.DateValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.DateValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Date)) {
                throw new TypeError('Invalid constraint');
            }

            if (typeof value === 'string') {
                if ((new Date(value)).toDateString() === 'Invalid Date') {
                    this.context.addViolation(constraint.getMessage());
                }
            } else if (!(value instanceof Date)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
