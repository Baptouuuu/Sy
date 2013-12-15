/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Lib/Generator/UUID.js
 * @venus-include ../../src/Lib/Logger/Interface.js
 * @venus-include ../../src/Lib/Mediator.js
 */

describe('mediator', function () {

    var mediator = null,
        gen = new Sy.Lib.Generator.UUID();

    beforeEach(function () {
        mediator = new Sy.Lib.Mediator();
        mediator.setGenerator(gen);
    });

    it('should return subscriber identifier string', function () {

        var key = mediator.subscribe({
            channel: 'foo',
            fn: function(){}
        });

        expect(typeof key).toEqual('string');

    });

    it('should return itself when removing subscriber', function () {

        var key = mediator.subscribe({
            channel: 'foo',
            fn: function(){}
        });

        expect(mediator.remove('foo', key)).toEqual(mediator);

    });

    it('should pause/unpause a channel', function () {

        var key = mediator.subscribe({
            channel: 'foo',
            fn: function(){}
        });

        mediator.pause('foo');

        expect(mediator.paused('foo')).toBe(true);

        mediator.unpause('foo');

        expect(mediator.paused('foo')).toBe(false);

    });

    it('should pause/unpause a channel\'s subscriber', function () {

        var switchValue = false,
            key = mediator.subscribe({
                channel: 'foo.subscriber',
                fn: function(){
                    switchValue = true;
                },
                async: false
            });

        mediator.pause('foo.subscriber', key);
        mediator.publish('foo.subscriber');

        expect(switchValue).toBe(false);

        mediator.unpause('foo.subscriber', key);
        mediator.publish('foo.subscriber');

        expect(switchValue).toBe(true);

    });

    it('should throw when setting bad generator', function () {

        expect(function () {
            mediator.setGenerator({});
        }).toThrow('Invalid generator');

    });

    it('should throw when setting bad logger', function () {

        expect(function () {
            mediator.setLogger({});
        }).toThrow('Invalid logger');

    });

    describe('channel', function () {

        var channel = null;

        beforeEach(function () {
            channel = new Sy.Lib.MediatorChannel('foo');
            channel.setGenerator(gen);
        });

        it('should throw when setting bad generator', function () {

            expect(function () {
                channel.setGenerator({});
            }).toThrow('Invalid generator');

        });

        it('should throw when setting bad logger', function () {

            expect(function () {
                channel.setLogger({});
            }).toThrow('Invalid logger');

        });

        it('should return subscriber identifier', function () {

            var key = channel.add(function(){}),
                key2 = channel.add(function(){});

            expect(typeof key).toEqual('string');
            expect(key).not.toEqual(key2);

        });

        it('should remove subscriber', function () {

            var called = false,
                key = channel.add(function () {
                    called = true;
                });

            channel.remove(key);
            channel.publish();

            expect(called).toBe(false);

        });

        it('should call subscriber', function () {

            var called = false,
                key = channel.add(
                    function () {
                        called = true;
                    },
                    {},
                    1,
                    false
                );

            channel.publish();

            expect(called).toBe(true);

        });

    });

});