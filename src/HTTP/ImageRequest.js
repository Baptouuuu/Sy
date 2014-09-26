namespace('Sy.HTTP');

/**
 * Object for requesting images via ajax
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Request}
 * @class
 */

Sy.HTTP.ImageRequest = function () {
    Sy.HTTP.Request.call(this);
    this.setType('blob');
    this.setHeader('Accept', 'image/*');
};
Sy.HTTP.ImageRequest.prototype = Object.create(Sy.HTTP.Request.prototype);
