/**
 * @venus-library jasmine
 * @venus-include ../src/functions.js
 * @venus-include ../src/FactoryInterface.js
 * @venus-include ../src/RegistryInterface.js
 * @venus-include ../src/Registry.js
 * @venus-include ../src/RegistryFactory.js
 * @venus-include ../src/StateRegistryInterface.js
 * @venus-include ../src/StateRegistry.js
 * @venus-include ../src/StateRegistryFactory.js
 * @venus-code ../src/Translator.js
 */

describe('translator', function () {

    var translator = new Sy.Translator(),
        registryFactory = new Sy.RegistryFactory(),
        stateRegistryFactory = new Sy.StateRegistryFactory();

    stateRegistryFactory.setRegistryFactory(registryFactory);

    translator.setRegistry(registryFactory.make());
    translator.setStateRegistryFactory(stateRegistryFactory);

    it('should return itself', function () {

        expect(translator.setRegistry(registryFactory.make())).toEqual(translator);
        expect(translator.setStateRegistryFactory(stateRegistryFactory)).toEqual(translator);
        expect(translator.setLanguage('fr')).toEqual(translator);
        expect(translator.registerTranslation('fr', 'root', 'bar', 'baz')).toEqual(translator);

    });

    it('should throw if invalid registry set', function () {

        expect(function () {
            translator.setRegistry({});
        }).toThrow('Invalid registry');

    });

    it('should throw if invalid state registry factory', function () {

        expect(function () {
            translator.setStateRegistryFactory({});
        }).toThrow('Invalid state registry factory');

    });

    it('should register a new transation string', function () {

        translator.registerTranslation('fr', 'domain', 'key', 'translation');

        expect(translator.languages.get('fr').get('domain', 'key')).toEqual('translation');

    });

    it('should register a set of translations', function () {

        translator.registerTranslations('fr', [
            {
                domain: 'domain',
                key: 'foobar',
                translation: 'baz'
            }
        ]);

        expect(translator.languages.get('fr').get('domain', 'foobar')).toEqual('baz');

    });

    it('should register a translation with default domain root', function () {

        translator.registerTranslations('fr', [
            {
                key: 'default domain',
                translation: 'baz'
            }
        ]);

        expect(translator.languages.get('fr').get('root', 'default domain')).toEqual('baz');

    });

    it('should return the key if no translation found', function () {

        translator.setLanguage('en');

        expect(translator.translate('unknown key')).toEqual('unknown key');
        expect(translator.translate('unknown key', 'unknown domain')).toEqual('unknown key');
        expect(translator.translate('unknown key', 'unknown domain', 'unknown language')).toEqual('unknown key');

    });

    it('should return translated string', function () {

        translator.registerTranslations('fr', [
            {
                key: 'symphony',
                translation: 'symphonie'
            },
            {
                domain: 'specific domain',
                key: 'framework',
                translation: 'structure'
            }
        ]);
        translator.registerTranslation('en', 'root', 'symphonie', 'symphony');

        translator.setLanguage('fr');

        expect(translator.translate('symphony')).toEqual('symphonie');
        expect(translator.translate('framework', 'specific domain')).toEqual('structure');
        expect(translator.translate('symphonie', null, 'en')).toEqual('symphony');

    });

});