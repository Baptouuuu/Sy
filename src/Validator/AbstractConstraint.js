namespace('Sy.Validator');

/**
 * Basic constraint that implement the `hasGroup` interface method
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.Validator.ConstraintInterface}
 */

Sy.Validator.AbstractConstraint = function (options) {
    Sy.Validator.ConstraintInterface.call(this, options);

    this.groups = options.groups instanceof Array ? options.groups : [];
};
Sy.Validator.AbstractConstraint.prototype = Object.create(Sy.Validator.ConstraintInterface.prototype, {

    /**
     * @inheritDoc
     */

    hasGroup: {
        value: function (group) {
            return this.groups instanceof Array && this.groups.indexOf(group) !== -1;
        }
    }

})
