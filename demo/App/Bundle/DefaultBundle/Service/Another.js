namespace('App.Bundle.DefaultBundle.Service');

App.Bundle.DefaultBundle.Service.Another = function () {

    Sy.Service.call(this);

};

App.Bundle.DefaultBundle.Service.Another.prototype = Object.create(Sy.Service.prototype, {

    processData: {
        value: function (data) {

            /*Do whatever you want*/

        }
    }

});