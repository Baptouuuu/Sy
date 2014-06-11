namespace('Sy.Form');

/**
 * Class use to build instances of classes implementing `Sy.Form.FormInterface`
 *
 * @package Sy
 * @subpackage Form
 * @interface
 */

Sy.Form.FormBuilderInterface = function () {};
Sy.Form.FormBuilderInterface.prototype = Object.create(Object.prototype, {

    /**
     * Add a new element to the form
     *
     * @param {String} name
     *
     * @return {Sy.Form.FormBuilderInterface} self
     */

    add: {
        value: function (name) {}
    },

    /**
     * Set the user defined options to the form
     *
     * @param {Sy.ConfiguratorInterface} config
     *
     * @return {Sy.Form.FormBuilderInterface} self
     */

    setOptions: {
        value: function (config) {}
    },

    /**
     * Set the form name
     *
     * @param {String} name
     *
     * @return {Sy.Form.FormBuilderInterface} self
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Set the object that will hold data to the form
     *
     * @param {Object} object
     *
     * @return {Sy.Form.FormBuilderInterface}
     */

    setObject: {
        value: function (object) {}
    },

    /**
     * Return the form
     *
     * @return {Sy.Form.FormInterface}
     */

    getForm: {
        value: function () {}
    }

});
