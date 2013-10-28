namespace('Sy');

Sy.service = new Sy.ServiceContainer('sy::core');

Sy.service.set('core::generator::uuid', function () {

    return new Sy.Lib.Generator.UUID();

});

Sy.service.set('core::mediator', function () {

    var m = new Sy.Lib.Mediator();

    m.setGenerator(Sy.service.get('core::generator::uuid'));
    m.setLogger(Sy.service.get('core::logger'));

    return m;

});

Sy.service.set('core::logger', function () {

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