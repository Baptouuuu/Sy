namespace('Sy.HTTP');

/**
 * Interface for HTTP response
 *
 * @package Sy
 * @subpackage HTTP
 * @interface
 */

Sy.HTTP.ResponseInterface = function () {};

Sy.HTTP.ResponseInterface.prototype = Object.create(Object.prototype, {

    HTTP_CONTINUE: {
        value: 100,
        writable: false
    },

    HTTP_SWITCHING_PROTOCOLS: {
        value: 101,
        writable: false
    },

    HTTP_PROCESSING: {
        value: 102,
        writable: false
    },

    HTTP_OK: {
        value: 200,
        writable: false
    },

    HTTP_CREATED: {
        value: 201,
        writable: false
    },

    HTTP_ACCEPTED: {
        value: 202,
        writable: false
    },

    HTTP_NON_AUTHORITATIVE_INFORMATION: {
        value: 203,
        writable: false
    },

    HTTP_NO_CONTENT: {
        value: 204,
        writable: false
    },

    HTTP_RESET_CONTENT: {
        value: 205,
        writable: false
    },

    HTTP_PARTIAL_CONTENT: {
        value: 206,
        writable: false
    },

    HTTP_MULTI_STATUS: {
        value: 207,
        writable: false
    },

    HTTP_ALREADY_REPORTED: {
        value: 208,
        writable: false
    },

    HTTP_IM_USED: {
        value: 226,
        writable: false
    },

    HTTP_MULTIPLE_CHOICES: {
        value: 300,
        writable: false
    },

    HTTP_MOVED_PERMANENTLY: {
        value: 301,
        writable: false
    },

    HTTP_FOUND: {
        value: 302,
        writable: false
    },

    HTTP_SEE_OTHER: {
        value: 303,
        writable: false
    },

    HTTP_NOT_MODIFIED: {
        value: 304,
        writable: false
    },

    HTTP_USE_PROXY: {
        value: 305,
        writable: false
    },

    HTTP_RESERVED: {
        value: 306,
        writable: false
    },

    HTTP_TEMPORARY_REDIRECT: {
        value: 307,
        writable: false
    },

    HTTP_PERMANENTLY_REDIRECT: {
        value: 308,
        writable: false
    },

    HTTP_BAD_REQUEST: {
        value: 400,
        writable: false
    },

    HTTP_UNAUTHORIZED: {
        value: 401,
        writable: false
    },

    HTTP_PAYMENT_REQUIRED: {
        value: 402,
        writable: false
    },

    HTTP_FORBIDDEN: {
        value: 403,
        writable: false
    },

    HTTP_NOT_FOUND: {
        value: 404,
        writable: false
    },

    HTTP_METHOD_NOT_ALLOWED: {
        value: 405,
        writable: false
    },

    HTTP_NOT_ACCEPTABLE: {
        value: 406,
        writable: false
    },

    HTTP_PROXY_AUTHENTICATION_REQUIRED: {
        value: 407,
        writable: false
    },

    HTTP_REQUEST_TIMEOUT: {
        value: 408,
        writable: false
    },

    HTTP_CONFLICT: {
        value: 409,
        writable: false
    },

    HTTP_GONE: {
        value: 410,
        writable: false
    },

    HTTP_LENGTH_REQUIRED: {
        value: 411,
        writable: false
    },

    HTTP_PRECONDITION_FAILED: {
        value: 412,
        writable: false
    },

    HTTP_REQUEST_ENTITY_TOO_LARGE: {
        value: 413,
        writable: false
    },

    HTTP_REQUEST_URI_TOO_LONG: {
        value: 414,
        writable: false
    },

    HTTP_UNSUPPORTED_MEDIA_TYPE: {
        value: 415,
        writable: false
    },

    HTTP_REQUESTED_RANGE_NOT_SATISFIABLE: {
        value: 416,
        writable: false
    },

    HTTP_EXPECTATION_FAILED: {
        value: 417,
        writable: false
    },

    HTTP_I_AM_TEAPOT: {
        value: 418,
        writable: false
    },

    HTTP_UNPROCESSABLE_ENTITY: {
        value: 422,
        writable: false
    },

    HTTP_LOCKED: {
        value: 423,
        writable: false
    },

    HTTP_FAILED_DEPENDENCY: {
        value: 424,
        writable: false
    },

    HTTP_RESERVED_FOR_WEBDAV_ADVANCED_COLLECTIONS_EXPIRED_PROPOSAL: {
        value: 425,
        writable: false
    },

    HTTP_UPGRADE_REQUIRED: {
        value: 426,
        writable: false
    },

    HTTP_PRECONDITION_REQURED: {
        value: 428,
        writable: false
    },

    HTTP_TOO_MANY_REQUESTS: {
        value: 429,
        writable: false
    },

    HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE: {
        value: 431,
        writable: false
    },

    HTTP_INTERNAL_SERVOR_ERROR: {
        value: 500,
        writable: false
    },

    HTTP_NOT_IMPLEMENTED: {
        value: 501,
        writable: false
    },

    HTTP_BAD_GATEWAY: {
        value: 502,
        writable: false
    },

    HTTP_SERVICE_UNAVAILABLE: {
        value: 503,
        writable: false
    },

    HTTP_GATEWAY_TIMEOUT: {
        value: 504,
        writable: false
    },

    HTTP_VERSION_NOT_SUPPORTED: {
        value: 505,
        writable: false
    },

    HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL: {
        value: 506,
        writable: false
    },

    HTTP_INSUFFICIENT_STORAGE: {
        value: 507,
        writable: false
    },

    HTTP_LOOP_DETECTED: {
        value: 508,
        writable: false
    },

    HTTP_NOT_EXTENDED: {
        value: 510,
        writable: false
    },

    HTTP_NETWORK_AUTHENTICATION_REQUIRED: {
        value: 511,
        writable: false
    },

    /**
     * Set the status code
     *
     * @param {int} code
     *
     * @return {Sy.HTTP.ResponseInterface}
     */

    setStatusCode: {
        value: function (code) {}
    },

    /**
     * Get the status code
     *
     * @return {int}
     */

    getStatusCode: {
        value: function () {}
    },

    /**
     * Set the status message
     *
     * @param {string} message
     *
     * @return {Sy.HTTP.ResponseInterface}
     */

    setStatusText: {
        value: function (message) {}
    },

    /**
     * Get status message
     *
     * @return {string}
     */

    getStatusText: {
        value: function () {}
    },

    /**
     * Set the list of headers
     *
     * @param {object} headers
     *
     * @return {Sy.HTTP.ResponseInterface}
     */

    setHeaders: {
        value: function (headers) {}
    },

    /**
     * Get the value of a header
     *
     * If no header specified it returns all of them
     *
     * @param {string} header
     *
     * @return {mixed}
     */

    getHeader: {
        value: function (header) {}
    },

    /**
     * Set the body data
     *
     * @param {mixed} body
     *
     * @return {Sy.HTTP.ResponseHeader}
     */

    setBody: {
        value: function (body) {}
    },

    /**
     * Get the body content
     *
     * @return {mixed}
     */

    getBody: {
        value: function () {}
    }

});