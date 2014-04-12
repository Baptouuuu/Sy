namespace('Sy');

/**
 * Class allowing to store translations string
 *
 * @package Sy
 * @class
 */

Sy.Translator = function () {
    this.currentLanguage = null;
    this.languages = null;
    this.stateRegistryFactory = null;
};

Sy.Translator.prototype = Object.create(Object.prototype, {

    /**
     * Set the language registry
     *
     * @param {Sy.Registry} registry
     *
     * @return {Sy.Translator}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.Registry)) {
                throw new TypeError('Invalid registry');
            }

            this.languages = registry;

            return this;

        }
    },

    /**
     * Set the state registry factory used to easily create new groups of translations
     *
     * @param {Sy.StateRegistryFactory} factory
     *
     * @return {Sy.Translator}
     */

    setStateRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.StateRegistryFactory)) {
                throw new TypeError('Invalid state registry factory');
            }

            this.stateRegistryFactory = factory;

            return this;

        }
    },

    /**
     * Set the language to translate to
     *
     * @param {string} language
     *
     * @return {Sy.Translator}
     */

    setLanguage: {
        value: function (language) {

            this.currentLanguage = language;
            return this;

        }
    },

    /**
     * Register new translations data
     *
     * @param {string} language
     * @param {string} domain Group of translations
     * @param {string} key Translation key
     * @param {string} translation Translated string
     *
     * @return {Sy.Translator}
     */

    registerTranslation: {
        value: function (language, domain, key, translation) {

            if (!this.languages.has(language)) {
                this.languages.set(
                    language,
                    this.stateRegistryFactory.make()
                );
            }

            this.languages.get(language).set(
                domain,
                key,
                translation
            );

            return this;

        }
    },

    /**
     * Register multiple translations at once
     *
     * The translations array is composed of objects like below:
     * <code>
     * {
     *     'domain': 'domain of the translation', //optional (default to root)
     *     'key': 'key to access translation',
     *     'translation': 'translated string'
     * }
     * </code>
     *
     * @param {string} language
     * @param {Array} translations
     *
     * @return {Sy.Translator}
     */

    registerTranslations: {
        value: function (language, translations) {

            for (var i = 0, l = translations.length; i < l; i++) {
                this.registerTranslation(
                    language,
                    translations[i].domain || 'root',
                    translations[i].key,
                    translations[i].translation
                );
            }

            return this;

        }
    },

    /**
     * Translate a string
     *
     * @param {string} key
     * @param {string} domain Optional (default to root)
     * @param {string} language Enforce the translation language, optional
     *
     * @return {string}
     */

    translate: {
        value: function (key, domain, language) {

            var lang = language || this.currentLanguage;
            domain = domain || 'root';

            if (
                !this.languages.has(lang) ||
                !this.languages.get(lang).has(domain, key)
            ) {
                return key;
            }

            return this.languages.get(lang).get(domain, key);

        }
    }

});