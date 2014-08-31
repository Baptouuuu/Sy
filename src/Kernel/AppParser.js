namespace('Sy.Kernel');

/**
 * Class used to inspect app object tree and extract meta informations
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.AppParser = function () {
    this.bundles = [];
    this.controllers = [];
    this.entities = [];
    this.logger = null;
};
Sy.Kernel.AppParser.prototype = Object.create(Object.prototype, {

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Kernle.AppParser}
     */

    setLogger: {
        value: function (logger) {
            this.logger = logger;

            return this;
        }
    },

    /**
     * Return the list of defined bundles
     *
     * @return {Array}
     */

    getBundles: {
        value: function () {

            if (this.bundles.length > 0 || !objectGetter('App.Bundle')) {
                return this.bundles;
            }

            for (var bundle in App.Bundle) {
                if (App.Bundle.hasOwnProperty(bundle)) {
                    this.bundles.push(bundle);
                    this.logger && this.logger.debug('Bundle found', bundle);
                }
            }

            return this.bundles;

        }
    },

    /**
     * Return an object with a correspondance controller alias => controller constructor
     *
     * @return {Object}
     */

    getControllers: {
        value: function () {

            if (this.controllers.length > 0) {
                return this.controllers;
            }

            var bundleCtrl;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleCtrl = App.Bundle[this.bundles[i]].Controller;

                if (!bundleCtrl) {
                    this.logger && this.logger.debug('No controller found in', this.bundles[i]);
                    continue;
                }

                for (var ctrl in bundleCtrl) {
                    if (bundleCtrl.hasOwnProperty(ctrl)) {
                        this.controllers.push({
                            name: this.bundles[i] + '::' + ctrl,
                            creator: bundleCtrl[ctrl]
                        });
                        this.logger && this.logger.debug('Controller found', this.bundles[i] + '::' + ctrl);
                    }
                }
            }

            return this.controllers;

        }
    },

    /**
     * Return the array of all defined entities
     *
     * @return {Array}
     */

    getEntities: {
        value: function () {

            if (this.entities.length > 0) {
                return this.entities;
            }

            var bundleEntities,
                bundleRepositories,
                alias,
                entity;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleEntities = App.Bundle[this.bundles[i]].Entity;
                bundleRepositories = App.Bundle[this.bundles[i]].Repository || {};

                if (!bundleEntities) {
                    this.logger && this.logger.debug('No entity found in', this.bundles[i]);
                    continue;
                }

                for (var name in bundleEntities) {
                    if (bundleEntities.hasOwnProperty(name)) {
                        alias = this.bundles[i] + '::' + name;
                        entity = bundleEntities[name];

                        this.entities.push({
                            alias: alias,
                            bundle: this.bundles[i],
                            name: name,
                            repository: bundleRepositories[name] || Sy.Storage.Repository,
                            entity: entity,
                            indexes: (new entity()).indexes,
                            uuid: entity.prototype.UUID
                        });

                        this.logger && this.logger.debug('Entity found ' + alias + (
                            bundleRepositories[name] ?
                                ' with custom repository' :
                                ''
                        ));
                    }
                }
            }

            return this.entities;

        }
    },

    /**
     * Walk through the app services definitions object
     * and call them to register them
     *
     * @param {Sy.ServiceContainer.Core} $container
     *
     * @return {Sy.Kernel.AppParser}
     */

    buildServices: {
        value: function (container) {

            if (!(container instanceof Sy.ServiceContainer.Core)) {
                throw new TypeError('Invalid service container');
            }

            var bundleConfig;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleConfig = App.Bundle[this.bundles[i]].Config;

                if (!bundleConfig || !bundleConfig.Service) {
                    continue;
                }

                bundleConfig = new bundleConfig.Service();
                bundleConfig.define(container);

                this.logger && this.logger.debug('Services loaded from ' + this.bundles[i] + ' bundle');
            }

            return this;

        }
    },

    /**
     * Walk through the app config definitions object
     * and call them to register them
     *
     * @param {Sy.ConfiguratorInterface} $config
     *
     * @return {Sy.Kernel.AppParser}
     */

    buildConfig: {
        value: function (config) {

            if (!(config instanceof Sy.ConfiguratorInterface)) {
                throw new TypeError('Invalid configurator');
            }

            var bundleConfig;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleConfig = App.Bundle[this.bundles[i]].Config;

                if (!bundleConfig || !bundleConfig.Configuration) {
                    continue;
                }

                bundleConfig = new bundleConfig.Configuration();
                bundleConfig.define(config);

                this.logger && this.logger.debug('Configuration loaded from ' + this.bundles[i] + ' bundle');
            }

            return this;

        }
    },

    /**
     * Walk through the app validation rules definitions object
     * and call them to register them in the validator
     *
     * @param {Sy.ServiceContainer.Core} container
     *
     * @return {Sy.Kernel.AppParser}
     */

    registerValidationRules: {
        value: function (container) {
            if (!(container instanceof Sy.ServiceContainer.Core)) {
                throw new TypeError('Invalid service container');
            }

            var validator = container.get('sy::core::validator'),
                bundleConfig;

            if (!(validator instanceof Sy.Validator.Core)) {
                throw new TypeError('Invalid validator');
            }

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleConfig = App.Bundle[this.bundles[i]].Config;

                if (!bundleConfig || !bundleConfig.Validation) {
                    continue;
                }

                bundleConfig = new bundleConfig.Validation();
                bundleConfig.define(validator);

                this.logger && this.logger.debug('Validation rules loaded from ' + this.bundles[i] + ' bundle');
            }

            return this;
        }
    }

});
