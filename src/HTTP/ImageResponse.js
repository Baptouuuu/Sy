namespace('Sy.HTTP');

/**
 * Image request response as blob
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Response}
 * @lass
 */

Sy.HTTP.ImageResponse = function () {
    Sy.HTTP.Response.call(this);
};
Sy.HTTP.ImageResponse.prototype = Object.create(Sy.HTTP.Response.prototype, {

    /**
     * Return the image blob
     *
     * @return {Blob}
     */

    getBlob: {
        value: function () {
            return this.getBody();
        }
    }

})