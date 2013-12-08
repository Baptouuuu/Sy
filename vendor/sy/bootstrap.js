namespace('Sy');

Sy.service = new Sy.ServiceContainer('sy::core');

Sy.service.set('sy::core::generator::uuid', function () {

    return new Sy.Lib.Generator.UUID();

});

Sy.service.set('sy::core::mediator', function () {

    var m = new Sy.Lib.Mediator();

    m.setGenerator(Sy.service.get('sy::core::generator::uuid'));
    m.setLogger(Sy.service.get('sy::core::logger'));

    return m;

});

Sy.service.set('sy::core::logger', function () {

    var logger = new Sy.Lib.Logger.CoreLogger('core'),
        info = new Sy.Lib.Logger.Handler.Console(logger.INFO),
        debug = new Sy.Lib.Logger.Handler.Console(logger.DEBUG),
        error = new Sy.Lib.Logger.Handler.Console(logger.ERROR),
        log = new Sy.Lib.Logger.Handler.Console(logger.LOG);

    logger.setHandler(info, logger.INFO);
    logger.setHandler(debug, logger.DEBUG);
    logger.setHandler(error, logger.ERROR);
    logger.setHandler(log, logger.LOG);

    return logger;

});

Sy.service.set('sy::core::http', function () {

    var parser = new Sy.HTTP.HeaderParser(),
        manager = new Sy.HTTP.Manager();

    manager.setParser(parser);
    manager.setGenerator(Sy.service.get('sy::core::generator::uuid'));

    return manager;

});

Sy.service.set('sy::core::http::rest', function () {

    var rest = new Sy.HTTP.REST();

    rest.setManager(Sy.service.get('sy::core::http'));

    return rest;

});