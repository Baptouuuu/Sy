namespace('Sy.Storage.Event');

/**
 * Event fired when modification happens at the storage engine level
 * meaning create/update/remove actions are called
 *
 * @package Sy
 * @subpackage Storage.Event
 * @class
 */

Sy.Storage.Event.LifecycleEvent = function (storageName, storeName, identifier, object) {
    this.storageName = storageName;
    this.storeName = storeName;
    this.identifier = identifier;
    this.object = object;
};
Sy.Storage.Event.LifecycleEvent.prototype = Object.create(Object.prototype, {

    PRE_CREATE: {
        value: 'storage::on::pre::create',
        writable: false
    },

    POST_CREATE: {
        value: 'storage::on::post::create',
        writable: false
    },

    PRE_UPDATE: {
        value: 'storage::on::pre:update',
        writable: false
    },

    POST_UPDATE: {
        value: 'storage::on::post::update',
        writable: false
    },

    PRE_REMOVE: {
        value: 'storage::on::pre::remove',
        writable: false
    },

    POST_REMOVE: {
        value: 'storage::on::post::remove',
        writable: false
    },

    /**
     * Return the storage name of the storage engine
     *
     * @return {String}
     */

    getStorageName: {
        value: function () {
            return this.storageName;
        }
    },

    /**
     * Return the store name of the data being manipulated
     *
     * @return {String}
     */

    getStoreName: {
        value: function () {
            return this.storeName;
        }
    },

    /**
     * Return the identifier of the object being manipulated,
     * available for update and remove events
     *
     * @return {String}
     */

    getIdentifier: {
        value: function () {
            return this.identifier;
        }
    },

    /**
     * Return the data being manipulated
     *
     * @return {Object}
     */

    getData: {
        value: function () {
            return this.object;
        }
    }

});
