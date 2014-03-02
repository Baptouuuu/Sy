namespace('Sy.View');

/**
 * Node wrapper to a view layout dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.NodeWrapper}
 */

Sy.View.Layout = function () {
    Sy.View.NodeWrapper.call(this);
    this.name = null;
    this.lists = null;
    this.parser = null;
    this.listFactory = null;
};
Sy.View.Layout.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * @inheritDoc
     */

    setNode: {
        value: function (node) {

            var lists,
                wrapper;

            Sy.View.NodeWrapper.prototype.setNode.call(this, node);

            this.name = node.dataset.syLayout;
            lists = this.parser.getLists(node);

            for (var i = 0, l = lists.length; i < l; i++) {
                wrapper = this.listFactory.make(lists[i]);

                this.lists.set(
                    wrapper.getName(),
                    wrapper
                );
            }

            return this;

        }
    },

    /**
     * Return the layout name
     *
     * @return {String}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Set the dom parser to look for list elements
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.Layout}
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
     * Set the registry to hold the lists
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.Layout}
     */

    setListsRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.lists = registry;

            return this;

        }
    },

    /**
     * Set the factory to build lists wrappers
     *
     * @param {Sy.View.ListFactoryInterface} factory
     *
     * @return {Sy.View.Layout}
     */

    setListFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.ListFactoryInterface)) {
                throw new TypeError('Invalid list factory');
            }

            this.listFactory = factory;

            return this;

        }
    },

    /**
     * Return the lists array
     *
     * @return {Array}
     */

    getLists: {
        value: function () {
            return this.lists.get();
        }
    }

});