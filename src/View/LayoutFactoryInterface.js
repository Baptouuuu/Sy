namespace('Sy.View');

/**
 * Interface to list dependencies for this factory
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.LayoutFactoryInterface = function () {};
Sy.View.LayoutFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the dom parser
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setParser: {
        value: function (parser) {}
    },

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setTemplateEngine: {
        value: function (engine) {}
    },

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setRegistryFactory: {
        value: function (factory) {}
    },

    /**
     * Set the layout factory
     *
     * @param {Sy.View.LayoutFactoryInterface} factory
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setListFactory: {
        value: function (factory) {}
    },

    /**
     * Inject a layout wrapper instance
     *
     * @param {String} viewscreen ViewScreen name it belongs to
     * @param {String} name Layout name it's attached to
     * @param {Sy.View.Layout} layout
     *
     * @return {Sy.View.LayoutFactoryInterface} self
     */

    setLayoutWrapper: {
        value: function (viewscreen, name, layout) {}
    }

});
