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
    this.queueFactory = null;
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
     * Set the queue factory used to easily create new groups of translations
     *
     * @param {Sy.QueueFactory} factory
     *
     * @return {Sy.Translator}
     */

    setQueueFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.QueueFactory)) {
                throw new TypeError('Invalid queue factory');
            }

            this.queueFactory = factory;

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
                    this.queueFactory.make()
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
    }

});