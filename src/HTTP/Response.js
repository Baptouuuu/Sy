namespace('Sy.HTTP');

/**
 * Default implementation of the ResponseInterface
 *
 * @package Sy
 * @subpackage HTTP
 * @implements {Sy.HTTP.ResponseInterface}
 * @class
 */

Sy.HTTP.Response = function () {

    this.statusCode = 0;
    this.statusText = null;
    this.headers = new Sy.Registry();
    this.body = null;

};

Sy.HTTP.Response.prototype = Object.create(Sy.HTTP.ResponseInterface.prototype, {

    /**
     * @inheritDoc
     */

    setStatusCode: {
        value: function (code) {

            this.statusCode = parseInt(code, 10);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getStatusCode: {
        value: function () {

            return this.statusCode;

        }
    },

    /**
     * @inheritDoc
     */

    setStatusText: {
        value: function (message) {

            this.statusText = message;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getStatusText: {
        value: function () {

            return this.statusText;

        }
    },

    /**
     * @inheritDoc
     */

    setHeaders: {
        value: function (headers) {

            for (var h in headers) {
                if (headers.hasOwnProperty(h)) {
                    this.headers.set(h, headers[h]);
                }
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getHeader: {
        value: function (header) {

            if (header === undefined) {

                return this.headers.getMapping();

            } else if (this.headers.has(header)) {

                return this.headers.get(header);

            }

            return undefined;

        }
    },

    /**
     * @inheritDoc
     */

    setBody: {
        value: function (body) {

            this.body = body;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getBody: {
        value: function () {

            return this.body;

        }
    }

});