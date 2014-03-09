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
     *
     * @return {Sy.View.TemplateEngineInterface}
     */

    render: {
        value: function (node, data) {}
    }

});
