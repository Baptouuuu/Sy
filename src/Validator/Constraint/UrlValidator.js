namespace('Sy.Validator.Constraint');

/**
 * Url constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.UrlValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.UrlValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Url)) {
                throw new TypeError('Invalid constraint');
            }

            var protocols = constraint.getProtocols().join('|'),
                regex = new RegExp('^(' + protocols + ')://[a-z\-\_\.]+(?:\.[a-z]{2,})?.*$', 'i');

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
