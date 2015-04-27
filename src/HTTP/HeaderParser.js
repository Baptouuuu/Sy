namespace('Sy.HTTP');

/**
 * Tools to ease extraction of each header and its value
 * from the headers string
 *
 * @package Sy
 * @subpackage HTTP
 * @class
 */

Sy.HTTP.HeaderParser = function () {};

Sy.HTTP.HeaderParser.prototype = Object.create(Object.prototype, {

    /**
     * Take the string of all headers and return an object
     * as key/value pairs for each header
     *
     * @param {string} headers
     *
     * @return {object}
     */

    parse: {
        value: function (headers) {

            var obj = {},
                headersList = headers.split('\n'),
                header,
                value,
                index;

            for (var i = 0, l = headersList.length; i < l; i++) {

                index = headersList[i].indexOf(':');
                header = headersList[i].substring(0, index);
                value = headersList[i].substring(index + 2);

                switch (header) {
                    case 'Date':
                    case 'Expires':
                    case 'Last-Modified':
                        value = new Date(value);
                        break;
                }

                obj[header] = value;

            }

            return obj;

        }
    }

});
