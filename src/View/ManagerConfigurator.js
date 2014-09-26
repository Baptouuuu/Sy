namespace('Sy.View');

/**
 * Help to build the manager by injecting viewscreens
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.ManagerConfigurator = function () {
    this.parser = null;
};

Sy.View.ManagerConfigurator.prototype = Object.create(Object.prototype, {

    /**
     * Set the dom parser
     *
     * @param {Sy.View.Parser} parser
     */

    setParser: {
        value: function (parser) {
            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;
        }
    },

    /**
     * Configure the manager
     *
     * @param {Sy.View.Manager} manager
     */

    configure: {
        value: function (manager) {
            if (!(manager instanceof Sy.View.Manager)) {
                throw new TypeError('Invalid manager');
            }

            var viewscreens = this.parser.getViewScreens();

            for (var i = 0, l = viewscreens.length; i < l; i++) {
                manager.setViewScreen(viewscreens[i]);

                if (!DOM(viewscreens[i]).isChildOf('.viewport')){
                    viewscreens[i].parentNode.removeChild(viewscreens[i]);
                }
            }
        }
    }

});
