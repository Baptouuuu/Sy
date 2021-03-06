namespace('App');

App.Kernel = function (env, debug) {
    Sy.Kernel.Core.call(this, env, debug);
};
App.Kernel.prototype = Object.create(Sy.Kernel.Core.prototype, {
    registerBundles: {
        value: function () {
            return [
                ['SyFrameworkBundle', Sy.FrameworkBundle],
                ['SyHttpBundle', Sy.HttpBundle],
                ['SyFormBundle', Sy.FormBundle],
                ['SyStorageBundle', Sy.StorageBundle],
                ['SyTranslatorBundle', Sy.TranslatorBundle],
                ['SyValidatorBundle', Sy.ValidatorBundle],
                ['SyViewBundle', Sy.ViewBundle],
                ['SyAppStateBundle', Sy.AppStateBundle],
                ['SyEventDispatcherBundle', Sy.EventDispatcherBundle],
                ['Todo', App.Bundle.Todo]
            ];
        }
    }
});
