namespace('Sy.Validator.Constraint');

/**
 * Email constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.EmailValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.EmailValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Email)) {
                throw new TypeError('Invalid constraint');
            }

            if (['', null, undefined].indexOf(value) !== -1) {
                return;
            }

            var regex = new RegExp(/^[a-z\.\-\_]+@[a-z\.\-\_]+\.[a-z]{2,}$/i);

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
