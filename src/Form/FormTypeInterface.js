namespace('Sy.Form');

/**
 * Representation of a form
 *
 * @package Sy
 * @subpackage Form
 * @interface
 */

Sy.Form.FormTypeInterface = function () {};
Sy.Form.FormTypeInterface.prototype = Object.create(Object.prototype, {

    /**
     * Pass the form builder to define the form elements
     *
     * @param {Sy.Form.FormBuilderInterface} builder
     * @param {Sy.ConfiguratorInterface} options
     *
     * @return {void}
     */

    buildForm: {
        value: function (builder, options) {}
    },

    /**
     * Set the default options for the form,
     * like the data class or the validation groups
     *
     * @param {Sy.ConfiguratorInterface} config
     */

    setDefaultOptions: {
        value: function (config) {}
    },

    /**
     * Set the form name
     *
     * @return {String}
     */

    getName: {
        value: function () {}
    }

});
