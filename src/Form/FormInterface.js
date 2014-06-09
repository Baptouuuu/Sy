namespace('Sy.Form');

/**
 * Representation of a form wrapper
 *
 * @package Sy
 * @subpackage Form
 * @interface
 */

Sy.Form.FormInterface = function () {};
Sy.Form.FormInterface.prototype = Object.create(Object.prototype, {

    /**
     * Add a new element to the form
     *
     * @param {String} name Name of the element in the dom, must be identical to the attribute of data class
     *
     * @return {Sy.Form.FormInterface} self
     */

    add: {
        value: function (name) {}
    },

    /**
     * Set the name of the form, will be used as the id
     * to look for form element in the dom
     *
     * @param {String} name
     *
     * @return {Sy.Form.FormInterface} self
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Return the form name
     *
     * @return {String}
     */

    getName: {
        value: function () {}
    },

    /**
     * Set the options config object
     *
     * @param {Sy.ConfiguratorInterface} config
     *
     * @return {Sy.Form.FormInterface} self
     */

    setOptions: {
        value: function (config) {}
    },

    /**
     * Check if the form data is valid by injecting data
     * to the object and then passing it to the validator
     *
     * If no validator set, it will use the html `checkValidity`
     *
     * @return {Boolean}
     */

    isValid: {
        value: function () {}
    },

    /**
     * Set the object that will hold form data
     *
     * @param {Object} object
     *
     * @return {Sy.Form.FormInterface}
     */

    setObject: {
        value: function (object) {}
    },

    /**
     * Return an instance of the data class
     *
     * @return {Object}
     */

    getObject: {
        value: function () {}
    },

    /**
     * Extract the data off of the form element
     * If no element specified it will check if
     * one has been defined previously
     *
     * @param {HTMLFormElement} form Optional
     *
     * @return {Sy.Form.FormInterface} self
     */

    handle: {
        value: function (form) {}
    },

    /**
     * Inject the validator
     *
     * @param {Sy.Validator.Core} validator
     *
     * @return {Sy.Form.FormInterface} self
     */

    setValidator: {
        value: function (validator) {}
    }

});
