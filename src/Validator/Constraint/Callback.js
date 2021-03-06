namespace('Sy.Validator.Constraint');

/**
 * Use a function to validate a value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Callback = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    if (options.callback === undefined) {
        throw new ReferenceError('Undefined constraint callback');
    }

    this.callback = options.callback;
};
Sy.Validator.Constraint.Callback.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

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
