/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/EventDispatcher/Event.js
 * @venus-code ../../src/Storage/LifeCycleEvent.js
 */

describe('storage lifecycle event', function () {
    it('should have the events values matching "store.(pre|post).(create|update|delete)"', function () {
        var event = new Sy.Storage.LifeCycleEvent();

        expect(event.PRE_CREATE).toBe('storage.pre.create');
        expect(event.POST_CREATE).toBe('storage.post.create');
        expect(event.PRE_UPDATE).toBe('storage.pre.update');
        expect(event.POST_UPDATE).toBe('storage.post.update');
        expect(event.PRE_REMOVE).toBe('storage.pre.remove');
        expect(event.POST_REMOVE).toBe('storage.post.remove');
    });

    it('should return the alias', function () {
        var e = new Sy.Storage.LifeCycleEvent('foo', {});

        expect(e.getAlias()).toEqual('foo');
    });

    it('should return the entity', function () {
        var e = new Sy.Storage.LifeCycleEvent('foo', {});

        expect(e.getEntity()).toEqual({});
    });

    it('should abort', function () {
        var e = new Sy.Storage.LifeCycleEvent('foo', {});

        expect(e.isAborted()).toBe(false);
        expect(e.abort()).toBe(e);
        expect(e.isAborted()).toBe(true);
    });
});
