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
    this.lists = null;
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

    setRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.lists = registry;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setListWrapper: {
        value: function (viewscreen, layout, name, list) {
            var fullname = viewscreen + '::' + layout + '::' + name;

            if (this.lists.has(fullname)) {
                throw new ReferenceError('A list wrapper is already defined with the name "' + fullname + '"')
            }

            if (!(list instanceof Sy.View.List)) {
                throw new TypeError('Invalid list wrapper');
            }

            this.lists.set(
                fullname,
                list
            );

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (viewscreen, layout, node) {

            var fullname = viewscreen + '::' + layout + '::' + node.dataset.syList,
                wrapper;

            if (this.lists.has(fullname)) {
                wrapper = this.lists.get(fullname);
            } else {
                wrapper = new Sy.View.List();
            }

            return wrapper
                .setViewScreenName(viewscreen)
                .setLayoutName(layout)
                .setTemplateEngine(this.engine)
                .setNode(node);

        }
    }

});
