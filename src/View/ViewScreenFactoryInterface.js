namespace('Sy.View');

/**
 * Interface to list dependencies for this factory
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.ViewScreenFactoryInterface = function () {};
Sy.View.ViewScreenFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the dom parser
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setParser: {
        value: function (parser) {}
    },

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setTemplateEngine: {
        value: function (engine) {}
    },

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setRegistryFactory: {
        value: function (factory) {}
    },

    /**
     * Set the layout factory
     *
     * @param {Sy.View.LayoutFactoryInterface} factory
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setLayoutFactory: {
        value: function (factory) {}
    },

    /**
     * Set viewscreen wrapper constructor
     *
     * @param {String} name Viewscreen name it's attached to
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.View.ViewScreenFactoryInterface} self
     */

    setViewScreenWrapper: {
        value: function (name, viewscreen) {}
    }

});
