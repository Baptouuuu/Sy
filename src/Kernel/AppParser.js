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
    this.viewscreens = [];
    this.services = [];
};
Sy.Kernel.AppParser.prototype = Object.create(Object.prototype, {

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
                    continue;
                }

                for (var ctrl in bundleCtrl) {
                    if (bundleCtrl.hasOwnProperty(ctrl)) {
                        this.controllers.push({
                            name: this.bundles[i] + '::' + ctrl,
                            creator: bundleCtrl[ctrl]
                        });
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
                    continue;
                }

                for (var name in bundleEntities) {
                    if (bundleEntities.hasOwnProperty(name)) {
                        alias = this.bundles[i] + '::' + name;
                        entity = bundleEntities[name];

                        this.entities.push({
                            name: alias,
                            repository: bundleRepositories[name] || Sy.Storage.Repository,
                            entity: entity,
                            indexes: (new entity()).indexes,
                            uuid: entity.prototype.UUID
                        });
                    }
                }
            }

            return this.entities;

        }
    },

    /**
     * Return the list of viewscreens wrappers
     *
     * @return {Array}
     */

    getViewScreens: {
        value: function () {

            if (this.viewscreens.length > 0) {
                return this.viewscreens;
            }

            var bundleViewScreens;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleViewScreens = App.Bundle[this.bundles[i]].ViewScreen;

                if (!bundleViewScreens) {
                    continue;
                }

                for (var name in bundleViewScreens) {
                    if (bundleViewScreens.hasOwnProperty(name)) {
                        this.viewscreens.push({
                            name: this.bundles[i] + '::' + name,
                            creator: bundleViewScreens[name]
                        });
                    }
                }
            }

            return this.viewscreens;

        }
    },

    /**
     * Return the list of services
     *
     * @return {Array}
     */

    getServices: {
        value: function () {

            if (this.services.length > 0) {
                return this.services;
            }

            var bundleConfig,
                services;

            for (var i = 0, l = this.bundles.length; i < l; i++) {
                bundleConfig = App.Bundle[this.bundles[i]].Config;

                if (!bundleConfig || !bundleConfig.Service) {
                    continue;
                }

                bundleConfig = new bundleConfig.Service();
                this.services = this.services.concat(bundleConfig.define());
            }

            return this.services;

        }
    }

});