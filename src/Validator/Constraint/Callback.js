namespace('Sy.Validator.Constraint');

/**
 * Use a function to validate a value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstratConstraint}
 */

Sy.Validator.Constraint.Callback = function (options) {
    Sy.Validator.AbstratConstraint.call(this, options);

    if (options.callback === undefined) {
        throw new ReferenceError('Undefined constraint callback');
    }

    this.callback = options.callback;
};
Sy.Validator.Constraint.Callback.prototype = Object.create(Sy.Validator.AbstratConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.CallbackValidator';
        }
    },

    /**
     * Return the callback
     *
     * @return {String}
     */

    getCallback: {
        value: function () {
            return this.callback;
        }
    }

});
