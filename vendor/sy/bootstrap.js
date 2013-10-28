namespace('Sy');

Sy.service = new Sy.ServiceContainer('sy::core');

Sy.service.set('core::generator::uuid', function () {

    return new Sy.Lib.Generator.UUID();

});

Sy.service.set('core::mediator', function () {

    var m = new Sy.Lib.Mediator();

    m.setGenerator(Sy.service.get('core::generator::uuid'));

    return m;

});