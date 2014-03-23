namespace('Sy.Kernel');

/**
 * Helper to ensure the browser is compatible with each
 * of the framework components
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.FeatureTester = function () {};
Sy.Kernel.FeatureTester.prototype = Object.create(Object.prototype, {

    /**
     * Test for json support
     *
     * @private
     * @throws {ReferenceError} If JSON is undefined or parse|stringify methods are not defined
     */

    testJSON: {
        value: function () {

            if (typeof JSON !== 'object') {
                throw new ReferenceError('JSON is not supported');
            }

            if (typeof JSON.parse !== 'function' || typeof JSON.stringify !== 'function') {
                throw new ReferenceError('JSON methods are not defined');
            }

        }
    },

    /**
     * Test for XMLHttpRequest and FormData support
     *
     * @private
     * @throws {ReferenceError} If XMLHttpRequest or FormData is not defined
     */

    testXHR: {
        value: function () {

            if (typeof XMLHttpRequest !== 'function') {
                throw new ReferenceError('XMLHttpRequest is not defined');
            }

            if (typeof FormData !== 'function') {
                throw new ReferenceError('FormData is not defined');
            }

        }
    },

    /**
     * Test the support for Function.prototype.bind
     *
     * @private
     * @throws {ReferenceError} If Function.prototype.bind is not defined
     */

    testBind: {
        value: function () {

            if (typeof Function.prototype.bind !== 'function') {
                throw new ReferenceError('The Function.bind method is not defined');
            }

        }
    },

    /**
     * Test for required node attributes (to check support for view engine)
     *
     * @private
     * @throws {ReferenceError} If HTMLElement.dataset is not defined or HTMLElement.attributes is not defined
     */

    testHTMLAttributes: {
        value: function () {

            if (!(document.body.dataset instanceof DOMStringMap)) {
                throw new ReferenceError('Element dataset not supported');
            }

            if(!(document.body.attributes instanceof NamedNodeMap)) {
                throw new ReferenceError('Element.attributes not defined');
            }

        }
    },

    /**
     * Test if the browser support the Element.addEventListener
     *
     * @throws {ReferenceError} If Element.addEventListener is not defined
     */

    testEventListener: {
        value: function () {

            if (typeof document.body.addEventListener !== 'function') {
                throw new ReferenceError('Element.addEventListener is not defined');
            }

        }
    },

    /**
     * Initiate the test suite
     *
     * @return {void}
     */

    testBrowser: {
        value: function () {

            this.testJSON();
            this.testXHR();
            this.testHTMLAttributes();
            this.testBind();
            this.testEventListener();

        }
    }

});
