namespace('Sy.Validator');

/**
 * Build the validator object of a constraint
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ConstraintValidatorFactory = function () {
    this.validators = {};
    this.accessor = new Sy.PropertyAccessor(true);
};
Sy.Validator.ConstraintValidatorFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (constraint) {

            if (!(constraint instanceof Sy.Validator.ConstraintInterface)) {
                throw new TypeError('Invalid constraint');
            }

            var path = constraint.validatedBy(),
                constructor;

            if (this.validators[path] === undefined) {
                if (!this.accessor.isReadable(window, path)) {
                    throw new ReferenceError('Undefined validator "' + path + '"');
                }

                constructor = this.accessor.getValue(window, path);

                this.validators[path] = new constructor();
            }

            return this.validators[path];

        }
    }

});