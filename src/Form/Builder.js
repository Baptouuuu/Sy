namespace('Sy.Form');

/**
 * Entry point to build form instances for the developer
 *
 * @package Sy
 * @subpackage Form
 * @class
 */

Sy.Form.Builder = function () {
    this.validator = null;
};
Sy.Form.Builder.prototype = Object.create(Object.prototype, {

    /**
     * Set the validator
     *
     * @param {Sy.Validator.core} validator
     *
     * @return {Sy.Form.Builder} self
     */

    setValidator: {
        value: function (validator) {
            if (!(validator instanceof Sy.Validator.Core)) {
                throw new TypeError('Invalid validator');
            }

            this.validator = validator;

            return this;
        }
    },

    /**
     * Create a form builder based on the object passed
     *
     * @param {Object} data
     * @param {Object} options
     *
     * @return {Sy.Form.FormBuilderInterface}
     */

    createFormBuilder: {
        value: function (data, options) {
            var builder = new Sy.Form.FormBuilder(),
                config = new Sy.Configurator();

            if (options) {
                config.set(options);
            }

            builder
                .setOptions(config)
                .setObject(data);

            if (this.validator) {
                builder.setValidator(this.validator);
            }

            return builder;
        }
    }

});
