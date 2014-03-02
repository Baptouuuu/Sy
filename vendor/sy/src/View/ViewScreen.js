namespace('Sy.View');

/**
 * Wrapper for a view screen dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.NodeWrapper}
 */

Sy.View.ViewScreen = function () {
    Sy.View.NodeWrapper.call(this);
    this.name = '';
    this.parser = null;
    this.layouts = null;
    this.layoutFactory = null;
};
Sy.View.ViewScreen.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * @inheritDoc
     */

    setNode: {
        value: function (node) {

            var layouts,
                wrapper;

            Sy.View.NodeWrapper.prototype.setNode.call(this, node);

            this.name = node.dataset.syView;
            layouts = this.parser.getLayouts(node);

            for (var i = 0, l = layouts.length; i < l; i++) {
                wrapper = this.layoutFactory.make(layouts[i]);

                this.layouts.set(
                    wrapper.getName(),
                    wrapper
                );
            }

            return this;

        }
    },

    /**
     * Return the view screen name
     *
     * @return {string}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Set the dom parser to look for layouts elements
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.ViewScreen}
     */

    setParser: {
        value: function (parser) {

            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;

            return this;

        }
    },

    /**
     * Set the registry to hold the layouts
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.ViewScreen}
     */

    setLayoutsRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.layouts = registry;

            return this;

        }
    },

    /**
     * Set the factory to build layouts wrappers
     *
     * @param {Sy.View.LayoutFactoryInterface} factory
     *
     * @return {Sy.View.ViewScreen}
     */

    setLayoutFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.LayoutFactoryInterface)) {
                throw new TypeError('Invalid layout factory');
            }

            this.layoutFactory = factory;

            return this;

        }
    },

    /**
     * Return the layouts array
     *
     * @return {Array}
     */

    getLayouts: {
        value: function () {
            return this.layouts.get();
        }
    }

});
