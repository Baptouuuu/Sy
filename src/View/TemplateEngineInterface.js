namespace('Sy.View');

/**
 * Parse DOM nodes and replace placeholders by the given data
 *
 * @package Sy
 * @subpackage View
 * @interface
 */

Sy.View.TemplateEngineInterface = function () {};
Sy.View.TemplateEngineInterface.prototype = Object.create(Object.prototype, {

    /**
     * Placeholder pattern
     */

    PATTERN: {
        value: new RegExp(/{{\s?([\w.]+)\s?}}/igm),
        writable: false,
        configurable: false
    },

    /**
     * Parse DOM nodes and replace placeholders by the given data
     *
     * @param {HTMLElement} node
     * @param {Object} data
     * @param {String} exempt CSS selector to exempt nodes of being rendered
     *
     * @return {Sy.View.TemplateEngineInterface}
     */

    render: {
        value: function (node, data, exempt) {}
    }

});
