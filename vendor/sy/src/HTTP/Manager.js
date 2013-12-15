namespace('Sy.HTTP');

/**
 * Accept Request objects and handle launching them,
 * it's possible to cancel them as well
 *
 * @package Sy
 * @subpackage HTTP
 * @class
 */

Sy.HTTP.Manager = function () {

    this.requests = new Sy.Registry();
    this.parser = null;
    this.generator = null;

};

Sy.HTTP.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set the response headers parser
     *
     * @param {object} parser
     *
     * @return {Sy.HTTP.Manager}
     */

    setParser: {
        value: function (parser) {

            this.parser = parser;

            return this;

        }
    },

    /**
     * Set an identifier generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.HTTP.Manager}
     */

    setGenerator: {
        value: function (generator) {

            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator type');
            }

            this.generator = generator;

            return this;

        }
    },

    /**
     * Init a new HTTP request
     *
     * @param {Sy.HTTP.RequestInterface} request
     *
     * @return {string} Identifier of the request
     */

    launch: {
        value: function (request) {

            if (!(request instanceof Sy.HTTP.RequestInterface)) {
                throw new TypeError('Invalid request type');
            }

            var uuid = this.generator.generate(),
                req = {
                    xhr: null,
                    obj: request,
                    uuid: uuid
                },
                headers = request.getHeader(),
                data = request.getData(),
                requestData = new FormData();

            req.xhr = new XMLHttpRequest();

            req.xhr.open(
                request.getMethod(),
                request.getURI()
            );

            req.xhr.UUID = uuid;

            req.xhr.addEventListener('readystatechange', this.listener.bind(this), false);

            switch (request.getType()) {
                case 'html':
                    req.xhr.responseType = 'document';
                    break;
                case 'json':
                    req.xhr.responseType = 'json';
                    break;
            }

            for (var header in headers) {
                if (headers.hasOwnProperty(header)) {
                    req.xhr.setRequestHeader(header, headers[header]);
                }
            }

            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    requestData.append(k, data[k]);
                }
            }

            req.xhr.send(requestData);

            this.requests.set(uuid, req);

            return uuid;

        }
    },

    /**
     * Listener wrapper for xhr state change
     *
     * @private
     *
     * @param {XMLHttpRequestProgressEvent} event
     *
     * @return {void}
     */

    listener: {
        value: function (event) {

            if (
                event.target.readyState === event.target.DONE &&
                this.requests.has(event.target.UUID)
            ) {

                var request = this.requests.get(event.target.UUID),
                    lstn = request.obj.getListener(),
                    headers = this.parser.parse(event.target.getAllResponseHeaders()),
                    response;

                if (
                    headers['Content-Type'].indexOf('application/json') !== -1 &&
                    request.obj.getType() === 'json'
                ) {

                    response = new Sy.HTTP.JSONResponse();

                } else if (
                    headers['Content-Type'].indexOf('text/html') !== -1 &&
                    request.obj.getType() === 'html'
                ) {

                    response = new Sy.HTTP.HTMLResponse();

                } else {

                    response = new Sy.HTTP.Response();

                }

                response.setHeaders(headers);
                response.setStatusCode(event.target.status);
                response.setStatusText(event.target.statusText);

                response.setBody(event.target.response);

                this.requests.remove(event.target.UUID);

                if (lstn.fn !== undefined) {

                    lstn.fn.call(lstn.context, response);

                }

            }

        }
    },

    /**
     * Abort a request
     *
     * @param {string} identifier
     *
     * @return {Sy.HTTP.Manager}
     */

    abort: {
        value: function (identifier) {

            var request = this.requests.get(identifier);

            request.xhr.abort();
            this.requests.remove(identifier);

            return this;

        }
    }

});