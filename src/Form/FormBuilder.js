namespace('Sy.Form');

/**
 * Default implementation of `FormBuilderInterface`
 *
 * @package Sy
 * @subpackage Form
 * @class
 * @implements {Sy.Form.FormBuilderInterface}
 */

Sy.Form.FormBuilder = function () {
    this.form = new Sy.Form.Form();
};
Sy.Form.FormBuilder.prototype = Object.create(Sy.Form.FormBuilderInterface.prototype, {

    /**
     * @inheritDoc
     */

    add: {
        value: function (name) {
            this.form.add(name);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setOptions: {
        value: function (config) {
            this.form.setOptions(config);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {
            this.form.setName(name);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setObject: {
        value: function (object) {
            this.form.setObject(object);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getForm: {
        value: function () {
            return this.form;
        }
    },

    /**
     * Set the validator to the form
     *
     * @param {Sy.Validator.Core} validator
     *
     * @return {Sy.Form.FormBuilder}
     */

    setValidator: {
        value: function (validator) {
            this.form.setValidator(validator);

            return this;
        }
    }

});
