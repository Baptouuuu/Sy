/**
 * @venus-library jasmine
 * @venus-include ../src/functions.js
 * @venus-include ../src/FactoryInterface.js
 * @venus-include ../src/RegistryInterface.js
 * @venus-include ../src/Registry.js
 * @venus-include ../src/RegistryFactory.js
 * @venus-include ../src/QueueInterface.js
 * @venus-include ../src/Queue.js
 * @venus-include ../src/QueueFactory.js
 * @venus-include ../src/Translator.js
 */

describe('translator', function () {

    var translator = new Sy.Translator(),
        registryFactory = new Sy.RegistryFactory(),
        queueFactory = new Sy.QueueFactory();

    queueFactory.setRegistryFactory(registryFactory);

    translator.setRegistry(registryFactory.make());
    translator.setQueueFactory(queueFactory);

    it('should return itself', function () {

        expect(translator.setRegistry(registryFactory.make())).toEqual(translator);
        expect(translator.setQueueFactory(queueFactory)).toEqual(translator);
        expect(translator.setLanguage('fr')).toEqual(translator);
        expect(translator.registerTranslation('fr', 'root', 'bar', 'baz')).toEqual(translator);

    });

    it('should throw if invalid registry set', function () {

        expect(function () {
            translator.setRegistry({});
        }).toThrow('Invalid registry');

    });

    it('should throw if invalid queue factory', function () {

        expect(function () {
            translator.setQueueFactory({});
        }).toThrow('Invalid queue factory');

    });

});