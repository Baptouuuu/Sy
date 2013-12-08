namespace('Sy.HTTP');

/**
 * Wrapper to ease the process of constructing REST calls
 *
 * @package Sy
 * @subpackage HTTP
 * @class
 */

Sy.HTTP.REST = function () {

    this.manager = null;

};

Sy.HTTP.REST.prototype = Object.create(Object.prototype, {

    /**
     * Set the http manager
     *
     * @param {Sy.HTTP.Manager} manager
     *
     * @return {Sy.HTTP.REST}
     */

    setManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.HTTP.Manager)) {
                throw new TypeError('Invalid manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * Make a request to the server with as options an object as follows
     *
     * <code>
     *   {
     *       data: {
     *           input: 'input value'
     *       },
     *       headers: {
     *           headerName: 'header value'
     *       },
     *       uri: 'url/to/request',
     *       listener: {
     *           fn: 'function to call',
     *           context: 'context object to apply on the function'
     *       },
     *       method: 'get|post|put|delete'
     *   }
     * </code>
     *
     * Every REST response as to be a JSON document
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    request: {
        value: function (args) {

            var request = new Sy.HTTP.JSONRequest();

            args.data = args.data || {};
            args.headers = args.headers || {};
            args.listener = args.listener || {};

            request.setMethod(args.method);
            request.setURI(args.uri);
            request.setHeader(args.headers);
            request.setData(args.data);
            request.setListener(
                args.listener.fn,
                args.listener.context
            );

            this.manager.launch(request);

        }
    },

    /**
     * Create a GET request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    get: {
        value: function (args) {

            args.method = 'get';

            this.request(args);

            return this;

        }
    },

    /**
     * Create a POST request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    post: {
        value: function (args) {

            args.method = 'post';

            this.request(args);

            return this;

        }
    },

    /**
     * Create a PUT request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    put: {
        value: function (args) {

            args.method = 'put';
            args.data = args.data || {_method: 'put'};

            this.request(args);

            return this;

        }
    },

    /**
     * Create a DELETE request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    remove: {
        value: function (args) {

            args.method = 'delete';
            args.data = args.data || {_method: 'delete'};

            this.request(args);

            return this;

        }
    }

});