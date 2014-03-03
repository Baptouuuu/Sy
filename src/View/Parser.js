namespace('Sy.View');

/**
 * DOM parser to look for viewscreen/layout/list inside a dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.Parser = function () {};
Sy.View.Parser.prototype = Object.create(Object.prototype, {

    /**
     * Return the elements matching the specified selector inside the dom node
     *
     * @param {String} selector Css selector
     * @param {HTMLElement} node Optional (default to document.body)
     *
     * @return {NodeList}
     */

    get: {
        value: function (selector, node) {

            node = node || document.body;

            return node.querySelectorAll(selector);
        }
    },

    /**
     * Return the list of viewscreen elements
     *
     * @param {HTMLElement} node Root node (optional)
     *
     * @return {NodeList}
     */

    getViewScreens: {
        value: function (node) {
            return this.get('[data-sy-view]', node);
        }
    },

    /**
     * Return the list of layout elements
     *
     * @param {HTMLElement} node Root node (optional)
     *
     * @return {NodeList}
     */

    getLayouts: {
        value: function (node) {
            return this.get('[data-sy-layout]', node);
        }
    },

    /**
     * Return the list of list elements
     *
     * @param {HTMLElement} node Root node (optional)
     *
     * @return {NodeList}
     */

    getLists: {
        value: function (node) {
            return this.get('[data-sy-list]', node);
        }
    }

});