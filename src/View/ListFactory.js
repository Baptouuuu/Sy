namespace('Sy.View');

/**
 * Default implementation of ListFactoryInterface
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.ListFactory = function () {
    this.engine = null;
};
Sy.View.ListFactory.prototype = Object.create(Sy.View.ListFactoryInterface.prototype, {

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

    make: {
        value: function (node) {

            var wrapper = new Sy.View.List();

            return wrapper
                .setTemplateEngine(this.engine)
                .setNode(node);

        }
    }

});
