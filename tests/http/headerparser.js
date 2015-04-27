/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-code ../../src/HTTP/HeaderParser.js
 */

describe('http header parser', function () {

    var p = new Sy.HTTP.HeaderParser();

    it('should parse headers string', function () {
        var headers = ['Content-Type: text/html; charset=utf-8', 'Date: Mon, 27 Apr 2015 11:28:51 GMT'];

        expect(p.parse(headers.join('\n'))).toEqual({
            'Content-Type': 'text/html; charset=utf-8',
            'Date': new Date('Mon, 27 Apr 2015 11:28:51 GMT')
        });
    });

    it('should return an array for multiple headers', function () {
        var headers = ['Link: http://somewhere', 'Link: http://else'];

        expect(p.parse(headers.join('\n'))).toEqual({
            Link: ['http://somewhere', 'http://else']
        });
    });

});
