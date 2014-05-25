/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/ViewPort.js
 * @venus-include ../../src/View/ViewScreen.js
 * @venus-include ../../src/Kernel/ControllerManager.js
 * @venus-include ../../src/Lib/Mediator.js
 * @venus-include ../../src/Lib/Logger/Interface.js
 * @venus-include ../../src/ControllerInterface.js
 * @venus-include ../../src/Controller.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/ServiceContainerInterface.js
 * @venus-include ../../src/Event/ControllerEvent.js
 * @venus-code ../../src/Kernel/ActionDispatcher.js
 */

describe('action dispatcher', function () {

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    var dispatcher = new Sy.Kernel.ActionDispatcher(),
        controllerManager = new Sy.Kernel.ControllerManager(),
        mockVS = function () {
            this.n = null;
        },
        mockVP = function () {},
        mockController = function () {},
        methodCalled = false,
        viewscreen;

    mockVS.prototype = Object.create(Sy.View.ViewScreen.prototype, {
        getNode: {
            value: function () {
                if (this.n === null) {
                    this.n = document.createElement('section');
                    this.n.dataset.syView = 'foo::bar';
                    this.n.dataset.syController = 'foo::bar';
                    this.n.appendChild(
                        document.createElement('div')
                    );
                    this.n.firstElementChild.dataset.syAction = 'some|click';
                }
                return this.n;
            }
        }
    });
    mockController.prototype = Object.create(Sy.Controller.prototype, {
        someAction: {
            value: function () {
                methodCalled = true;
            }
        }
    });
    mockVP.prototype = Object.create(Sy.View.ViewPort.prototype, {
        getCurrentViewScreen: {
            value: function () {
                return viewscreen;
            }
        }
    })

    namespace('App.Bundle.foo');

    controllerManager
        .setMetaRegistry(new Sy.Registry())
        .setLoadedControllersRegistry(new Sy.Registry())
        .setServiceContainer(new Sy.ServiceContainerInterface())
        .setMediator(new Sy.Lib.Mediator())
        .registerController('foo::bar', mockController);

    it('should throw if trying to set invalid viewport', function () {
        expect(function () {
            dispatcher.setViewPort({});
        }).toThrow('Invalid viewport');
    });

    it('should set the viewport', function () {
        expect(dispatcher.setViewPort(new mockVP())).toEqual(dispatcher);
    });

    it('should throw if trying to set invalid controller manager', function () {
        expect(function () {
            dispatcher.setControllerManager({});
        }).toThrow('Invalid controller manager');
    });

    it('should set the controller manager', function () {
        expect(dispatcher.setControllerManager(controllerManager)).toEqual(dispatcher);
    });

    it('should throw if trying to set invalid mediator', function () {
        expect(function () {
            dispatcher.setMediator({});
        }).toThrow('Invalid mediator');
    });

    it('should set the mediator', function () {
        expect(dispatcher.setMediator(new Sy.Lib.Mediator())).toEqual(dispatcher);
    });

    it('should throw if trying to set invalid logger', function () {
        expect(function () {
            dispatcher.setLogger({});
        }).toThrow('Invalid logger');
    });

    it('should set the logger', function () {
        expect(dispatcher.setLogger(new Sy.Lib.Logger.Interface())).toEqual(dispatcher);
    });

    it('should throw if trying to bind invalid viewscreen', function () {
        expect(function () {
            dispatcher.bindViewScreen({});
        }).toThrow('Invalid viewscreen');
    });

    it('should bind viewscreens', function () {
        viewscreen = new mockVS();
        expect(dispatcher.bindViewScreens([viewscreen])).toEqual(dispatcher);
    });

    it('should call a controller method', function () {
        runs(function () {
            var evt = document.createEvent('MouseEvent');

            evt.initMouseEvent(
                'click',
                true,
                true,
                window,
                null,
                0, 0, 0, 0, /*coordinates*/
                false, false, false, false, /*modifier keys*/
                0,
                null
            );

            viewscreen.getNode().firstElementChild.dispatchEvent(evt);
        });

        waits(500);

        runs(function () {
            expect(methodCalled).toEqual(true);
        });
    });

});