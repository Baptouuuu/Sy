namespace('Sy.View');

/**
 * Interface to list dependencies for this factory
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.ListFactoryInterface = function () {};
Sy.View.ListFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.ListFactoryInterface}
     */

    setTemplateEngine: {
        value: function (engine) {}
    },

    /**
     * Set a registry to hold custom list wrappers
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.ListFactoryInterface} self
     */

    setRegistry: {
        value: function (registry) {}
    },

    /**
     * Inject a custom list wrapper
     *
     * @param {String} viewscreen ViewScreen name it belongs to
     * @param {String} layout Layout name it belongs to
     * @param {String} name List it's attached to
     * @param {Sy.View.List} list
     *
     * @return {Sy.View.ListFactoryInterface} self
     */

    setListWrapper: {
        value: function (viewscreen, layout, name, list) {}
    }

});
