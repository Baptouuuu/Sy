namespace('Sy.Validator.Constraint');

/**
 * Check that a value is an IP address
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Ip = function (options) {
    Sy.Validator.AbstractConstraint.call(this, options);

    this.v6 = !!options.v6;
    this.port = !!options.port;
    this.mask = !!options.mask;
    this.message = options.message || 'The value is not a valid IP address';
};
Sy.Validator.Constraint.Ip.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.IpValidator';
        }
    },

    /**
     * Is it an IP v6 address
     *
     * @return {Boolean}
     */

    isIpV6: {
        value: function () {
            return this.v6;
        }
    },

    /**
     * Does it must have a port specified
     *
     * @return {Boolean}
     */

    hasPort: {
        value: function () {
            return this.port;
        }
    },

    /**
     * Does it must have a wildcard mask
     *
     * @return {Boolean}
     */

    hasMask: {
        value: function () {
            return this.mask;
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
