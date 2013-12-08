namespace('Sy.HTTP');

/**
 * Response when JSON is returned
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Response}
 * @class
 */

Sy.HTTP.JSONResponse = function () {

    Sy.HTTP.Response.call(this);

};

Sy.HTTP.JSONResponse.prototype = Object.create(Sy.HTTP.Response.prototype);