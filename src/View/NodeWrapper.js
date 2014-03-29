namespace('Sy.View');

/**
 * Abstract class to centralise getter/setter for node element + template engine setter
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.NodeWrapper = function () {
    this.engine = null;
    this.node = null;
};
Sy.View.NodeWrapper.prototype = Object.create(Object.prototype, {

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.NodeWrapper}
     */

    setTemplateEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.View.TemplateEngineInterface)) {
                throw new TypeError('Invalid template engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * Set the dom node
     *
     * @param {HTMLElement} node
     *
     * @return {Sy.View.NodeWrapper}
     */

    setNode: {
        value: function (node) {

            if (!(node instanceof HTMLElement)) {
                throw new TypeError('Invalid dom node');
            }

            this.node = node;

            return this;

        }
    },

    /**
     * Return the dom node
     *
     * @return {HTMLElement}
     */

    getNode: {
        value: function () {
            return this.node;
        }
    },

    /**
     * Render the node with the specified data
     *
     * @param {Object} data
     *
     * @return {Sy.View.NodeWrapper}
     */

    render: {
        value: function (data) {

            this.engine.render(this.node, data);

            return this;

        }
    },

    /**
     * Find one element in the node tree matching the given selector
     *
     * @param {String} selector Css selector
     *
     * @return {HTMLElement|null}
     */

    findOne: {
        value: function (selector) {
            return this.node.querySelector(selector);
        }
    },

    /**
     * Find a set of elements in the node tree matching the given selector
     *
     * @param {String} selector Css selector
     *
     * @return {NodeList}
     */

    find: {
        value: function (selector) {
            return this.querySelectorAll(selector);
        }
    }

});
