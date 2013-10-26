namespace('App.Bundle.DefaultBundle.Service');

App.Bundle.DefaultBundle.Service.Another = function () {

    Sy.Service.call(this);

};

App.Bundle.DefaultBundle.Service.Another.prototype = Object.create(Sy.Service.prototype, {

    configure: {
        value: function () {

            return {
                name: 'another'     /*beware of your services naming, those are global to your app*/
            };

        }
    },

    processData: {
        value: function (data) {

            /*Do whatever you want*/

        }
    }

});