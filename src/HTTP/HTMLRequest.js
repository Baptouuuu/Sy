namespace('Sy.HTTP');

/**
 * Object for requesting DOM elements via ajax
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Request}
 * @class
 */

Sy.HTTP.HTMLRequest = function () {

    Sy.HTTP.Request.call(this);

    this.setType('html');
    this.setHeader('Accept', 'text/html,application/xhtml+xml');

};

Sy.HTTP.HTMLRequest.prototype = Object.create(Sy.HTTP.Request.prototype);