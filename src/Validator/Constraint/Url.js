namespace('Sy.Validator.Constraint');

/**
 * Check that a value is a valid url
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Url = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.protocols = options.protocols instanceof Array ? options.protocols : ['http', 'https'];
    this.message = options.message || 'The value is not a valid url';
};
Sy.Validator.Constraint.Url.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.UrlValidator';
        }
    },

    /**
     * Return the protocols
     *
     * @return {Array}
     */

    getProtocols: {
        value: function () {
            return this.protocols;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});
