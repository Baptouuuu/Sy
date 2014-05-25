/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/ControllerInterface.js
 * @venus-code ../../src/Event/ControllerEvent.js
 */

describe('event controller', function () {

    it('should throw an error if invalid controller', function () {
        expect(function () {
            new Sy.Event.ControllerEvent({});
        }).toThrow('Invalid controller');
    });

    it('should throw an error if invalid action variable type', function () {
        expect(function () {
            new Sy.Event.ControllerEvent(new Sy.ControllerInterface(), {});
        }).toThrow('Invalid action');
    });

    it('should return the controller instance', function () {
        var c = new Sy.ControllerInterface(),
            e = new Sy.Event.ControllerEvent(c, '');

        expect(e.getController()).toEqual(c);
    });

    it('should return the action method name', function () {
        var e = new Sy.Event.ControllerEvent(new Sy.ControllerInterface(), 'foo');

        expect(e.getAction()).toEqual('foo');
    });

});
