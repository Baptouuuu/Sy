/**
 * @venus-library jasmine
 * @venus-include ../../vendor/Reflection.js/reflection.min.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/Lib/Mediator.js
 * @venus-include ../../src/ControllerInterface.js
 * @venus-include ../../src/Controller.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/ViewScreen.js
 * @venus-code ../../src/Kernel/ActionBinder.js
 * @venus-fixture ../../fixtures/kernel/viewscreen.html
 */

describe('kernel action binder', function () {

    var binder = new Sy.Kernel.ActionBinder(),
        mockController = function () {
            Sy.Controller.call(this);
        },
        mockVS = function () {},
        actionCalled = false,
        node = document.body.querySelector('[data-sy-view]'),
        actionable = node.firstElementChild;

    mockController.prototype = Object.create(Sy.Controller.prototype, {
        testAction: {
            value: function (event) {
                actionCalled = true;
            }
        }
    });

    mockVS.prototype = Object.create(Sy.View.ViewScreen.prototype, {
        getNode: {
            value: function () {
                return node;
            }
        }
    });

    it('should throw if trying to set invalid mediator', function () {
        expect(function () {
            binder.setMediator({});
        }).toThrow('Invalid mediator');
    });

    it('should set the mediator', function () {
        expect(binder.setMediator(new Sy.Lib.Mediator())).toEqual(binder);
    });

    it('should throw if trying to bind invalid controller', function () {
        expect(function () {
            binder.bind({}, {});
        }).toThrow('Invalid controller');
    });

    it('should throw if trying to bind invalid viewscreen', function () {
        expect(function () {
            binder.bind(new mockController(), {});
        }).toThrow('Invalid viewscreen');
    });

    it('should bind the controller action to the click event', function () {
        runs(function () {
            var controller = new mockController(),
                vs = new mockVS();

            binder.bind(controller, vs);
            actionable.click();
        });

        waits(500);

        runs(function () {
            expect(actionCalled).toBe(true);
        });
    });

    it('should throw if trying to bind to unknown method', function () {
        actionable.dataset.syAction = 'foo|click';

        expect(function () {
            binder.bind(new mockController(), new mockVS());
        }).toThrow('Undefined method "fooAction"');
    });

});
