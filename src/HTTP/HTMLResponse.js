namespace('Sy.HTTP');

/**
 * Response when HTML is returned
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Response}
 * @class
 */

Sy.HTTP.HTMLResponse = function () {

    Sy.HTTP.Response.call(this);

};

Sy.HTTP.HTMLResponse.prototype = Object.create(Sy.HTTP.Response.prototype);