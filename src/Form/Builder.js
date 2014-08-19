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
    this.types = {};
    this.accessor = new Sy.PropertyAccessor(true);
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
    },

    /**
     * Register a new form type
     *
     * @param {Sy.Form.FormTypeInterface} formType
     *
     * @return {Sy.Form.Builder} self
     */

    registerFormType: {
        value: function (formType) {
            if (!(formType instanceof Sy.Form.FormTypeInterface)) {
                throw new TypeError('Invalid form type');
            }

            this.types[formType.getName()] = formType;

            return this;
        }
    },

    /**
     * Create a form based on the form type
     *
     * @param {Sy.Form.FormTypeInterface|String} formType
     * @param {Object} object Optional, object that will hold form data
     * @param {Object} options
     *
     * @return {Sy.Form.FormInterface}
     */

    createForm: {
        value: function (formType, object, options) {
            if (typeof formType === 'string') {
                if (!this.types[formType]) {
                    throw new ReferenceError('Form type "' + formType + '" is undefined');
                }

                formType = this.types[formType];
            }

            var builder = new Sy.Form.FormBuilder(),
                config = new Sy.Configurator(),
                dataClass;

            builder.setName(formType.getName());
            formType.setDefaultOptions(config);

            if (options) {
                for (var prop in options) {
                    if (options.hasOwnProperty(prop)) {
                        config.set(prop, options[prop]);
                    }
                }
            }

            formType.buildForm(builder, config);

            builder.setOptions(config);

            if (!object && config.has('dataClass')) {
                if (!this.accessor.isReadable(window, config.get('dataClass'))) {
                    throw new ReferenceError('Data class "' + config.get('dataClass') + '" is undefined');
                }

                dataClass = this.accessor.getValue(window, config.get('dataClass'));

                builder.setObject(new dataClass());
            } else if (object && typeof object === 'object') {
                if (
                    config.has('dataClass') &&
                    !(object instanceof this.accessor.getValue(window, config.get('dataClass')))
                ) {
                    throw new TypeError('The object is not an instance of "' + config.get('dataClass') + '"');
                }

                builder.setObject(object);
            }

            if (this.validator) {
                builder.setValidator(this.validator);
            }

            return builder.getForm();
        }
    }

});
