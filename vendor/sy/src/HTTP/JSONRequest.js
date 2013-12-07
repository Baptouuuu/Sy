namespace('Sy.HTTP');

/**
 * Object for requesting JSON documents via ajax
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Request}
 * @class
 */

Sy.HTTP.JSONRequest = function () {

    Sy.HTTP.Request.call(this);

    this.setType('json');
    this.setHeader('Accept', 'application/json');

};

Sy.HTTP.JSONRequest.prototype = Object.create(Sy.HTTP.Request.prototype);