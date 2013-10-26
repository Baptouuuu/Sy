namespace('App.Bundle.DefaultBundle.Service');

App.Bundle.DefaultBundle.Service.MyService = function () {

    Sy.Service.call(this);

};

App.Bundle.DefaultBundle.Service.MyService.prototype = Object.create(Sy.Service.prototype, {

    configure: {
        value: function () {

            this.depd = this.container.get('another');

            return {
                name: 'my::service'     /*beware of your services naming, those are global to your app*/
            };

        }
    },

    someMethod: {
        value: function () {

            /*Do whatever you want*/
            this.depd.processData({
                foo: 'bar'
            });

        }
    }

});