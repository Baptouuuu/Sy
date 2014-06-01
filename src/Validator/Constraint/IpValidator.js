namespace('Sy.Validator.Constraint');

/**
 * Ip constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.IpValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.IpValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Ip)) {
                throw new TypeError('Invalid constraint');
            }

            var portRegex = ':[0-9]{1,6}',
                maskRegex = '\\/(?:[12][0-9]|3[0-2]|[0-9])',
                regex = '^(?:[01]?[0-9]?[0-9]\.|2[0-4][0-9]\.|25[0-5]\.){3}(?:[01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]){1}';

            if (constraint.hasPort()) {
                regex += portRegex;
            }

            if (constraint.hasMask()) {
                regex += maskRegex;
            }

            regex = new RegExp(regex + '$');

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});
