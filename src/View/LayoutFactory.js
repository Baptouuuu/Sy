namespace('Sy.View');

/**
 * Default implementation of LayoutFactoryInterface
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.LayoutFactoryInterface}
 */

Sy.View.LayoutFactory = function () {
    this.parser = null;
    this.engine = null;
    this.registryFactory = null;
    this.listFactory = null;
    this.layouts = null;
};
Sy.View.LayoutFactory.prototype = Object.create(Sy.View.LayoutFactoryInterface.prototype, {

    /**
     * @inheritDoc
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
     * @inheritDoc
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
     * @inheritDoc
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid registry factory');
            }

            this.registryFactory = factory;
            this.layouts = factory.make();

            return this;

        }
    },

    /**
     * @inheritDoc
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
     * @inheritDoc
     */

    setLayoutWrapper: {
        value: function (viewscreen, name, layout) {
            var fullname = viewscreen + '::' + name;

            if (this.layouts.has(fullname)) {
                throw new ReferenceError('A layout wrapper is already defined with the name "' + fullname + '"')
            }

            if (!(layout instanceof Sy.View.Layout)) {
                throw new TypeError('Invalid layout wrapper');
            }

            this.layouts.set(
                fullname,
                layout
            );

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (viewscreen, node) {

            var fullname = viewscreen + '::' + node.dataset.syLayout,
                wrapper;

            if (this.layouts.has(fullname)) {
                wrapper = this.layouts.get(fullname);
            } else {
                wrapper = new Sy.View.Layout();
            }

            return wrapper
                .setViewScreenName(viewscreen)
                .setParser(this.parser)
                .setListFactory(this.listFactory)
                .setListsRegistry(this.registryFactory.make())
                .setTemplateEngine(this.engine)
                .setNode(node);

        }
    }

});
