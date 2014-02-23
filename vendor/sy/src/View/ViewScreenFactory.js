namespace('Sy.View');

/**
 * Default implementation of ViewScreenFactoryInterface
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.ViewScreenFactoryInterface}
 */

Sy.View.ViewScreenFactory = function () {
    this.parser = null;
    this.engine = null;
    this.registryFactory = null;
    this.layoutFactory = null;
};
Sy.View.ViewScreenFactory.prototype = Object.create(Sy.View.ViewScreenFactoryInterface.prototype, {

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

            return this;

        }
    },

    /**
     * @inheritDoc
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
     * @inheritDoc
     */

    make: {
        value: function (node) {

            var wrapper = new Sy.View.ViewScreen();

            return wrapper
                .setParser(this.parser)
                .setLayoutFactory(this.layoutFactory)
                .setLayoutsRegistry(this.registryFactory.make())
                .setTemplateEngine(this.engine)
                .setNode(node);

        }
    }

});
