namespace('Sy.View');

/**
 * Handles the app views collection
 *
 * @package Sy
 * @subpackage View
 * @class
 */
Sy.View.Manager = function () {
    this.views = null;
    this.factory = null;
};
Sy.View.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry object
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.Manager}
     */

    setViewsRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.views = registry;

            return this;

        }
    },

    /**
     * Set the view screen wrapper factory
     *
     * @param {Sy.View.ViewScreenFactoryInterface} factory
     *
     * @return {Sy.View.Manager}
     */

    setViewScreenFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.ViewScreenFactoryInterface)) {
                throw new TypeError('Invalid factory');
            }

            this.factory = factory;

            return this;

        }
    },

    /**
     * Set a new view screen node
     *
     * @param {HTMLElement} node
     *
     * @return {Sy.View.Manager}
     */

    setViewScreen: {
        value: function (node) {

            if (!(node instanceof HTMLElement)) {
                throw new TypeError('Html node expected');
            }

            var name = node.dataset.syView;

            if (!name && name.trim() === '') {
                throw new SyntaxError('Attribute "data-sy-view" is expected');
            }

            if (this.views.has(name.trim())) {
                throw new ReferenceError('A view with the name "' + name.trim() + '"');
            }

            this.views.set(
                name.trim(),
                this.factory.make(node)
            );

            return this;

        }
    },

    /**
     * Return the node wrapper for the specified view screen name
     *
     * @param {string} name
     *
     * @return {Sy.View.ViewScreenInterface}
     */

    getViewScreen: {
        value: function (name) {

            if (!this.views.has(name)) {
                throw new ReferenceError('The view screen "' + name + '" is not registered');
            }

            return this.views.get(name);

        }
    },

    /**
     * Return an array of all registered viewscreens
     *
     * @return {Array}
     */

    getViewScreens: {
        value: function () {
            return this.views.get();
        }
    }

});
