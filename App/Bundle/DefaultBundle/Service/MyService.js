namespace('App.Bundle.DefaultBundle.Service');

App.Bundle.DefaultBundle.Service.MyService = function () {

    Sy.Service.call(this);

};

App.Bundle.DefaultBundle.Service.MyService.prototype = Object.create(Sy.Service.prototype, {

    someMethod: {
        value: function () {

            /*Do whatever you want*/
            this.depd.processData({
                foo: 'bar'
            });

        }
    },

    setDependency: {
        value: function (object) {

            if(object instanceof App.Bundle.DefaultBundle.Service.Another) {
                this.depd = object;
            }

        }
    }

});