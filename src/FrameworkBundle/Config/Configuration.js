namespace('Sy.FrameworkBundle.Config');

/**
 * Basic configuration needed by the framework
 *
 * @package Sy
 * @subpackage FrameworkBundle
 * @class
 */

Sy.FrameworkBundle.Config.Configuration = function () {};
Sy.FrameworkBundle.Config.Configuration.prototype = Object.create(Object.prototype, {
    define: {
        value: function (config) {
            config.set({
                controllers: {
                    cache: true
                },
                logger: {
                    level: {
                        info: Sy.Lib.Logger.CoreLogger.prototype.INFO,
                        debug: Sy.Lib.Logger.CoreLogger.prototype.DEBUG,
                        error: Sy.Lib.Logger.CoreLogger.prototype.ERROR,
                        log: Sy.Lib.Logger.CoreLogger.prototype.LOG,
                    }
                }
            });
        }
    }
});