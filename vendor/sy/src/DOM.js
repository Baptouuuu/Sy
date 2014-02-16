/**
 * Helper to abstract browsers diffs and extend dom manipulation
 *
 * @class
 */

DOM = function (node) {

    if (this === window) {
        return new DOM(node);
    }

    this.node = node;

};

DOM.prototype = Object.create(Object.prototype, {

    /**
     * Check if the node if a child of the specified node or css selector
     *
     * @param {string|HTMLElement} toMatch Parent node or css selector representing a parent
     * @param {HTMLElement} node Optional, default to instance node
     *
     * @return {Boolean}
     */

    isChildOf: {
        value: function (toMatch, node) {

            node = node || this.node;

            if (toMatch instanceof HTMLElement) {
                if (toMatch === node) {
                    return true;
                } else {
                    return this.isChildOf(toMatch, node.parentNode);
                }
            } else if (typeof toMatch === 'string') {
                if (this.matches(toMatch)) {
                    return true;
                } else {
                    return this.matches(toMatch, node.parentNode);
                }
            }

            return false;

        }
    },

    /**
     * Check if the node match a css selector
     *
     * @param {string} selector
     * @param {HTMLElement} node Optional, default to instance node
     *
     * @return {Boolean}
     */

    matches: {
        value: function (selector, node) {

            node = node || this.node;

            if (node.matches && node.matches(selector)) {
                return true;
            } else if (node.webkitMatchesSelector && node.webkitMatchesSelector(selector)) {
                return true;
            } else if (node.mozMatchesSelector && node.mozMatchesSelector(selector)) {
                return true;
            } else if (node.msMatchesSelector && node.msMatchesSelector(selector)) {
                return true;
            }

            return false;

        }
    }

});