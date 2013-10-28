namespace('Sy.Lib');

Sy.Lib.Mediator = function () {

    this.channels = {};
    this.generator = null;

};

Sy.Lib.Mediator.prototype = Object.create(Object.prototype, {

    /**
        * Add a subscriber to a channel
    */

    subscribe: {
        value: function (options) {

            var options = options || {},
                channel = null;

            if (options.priority === undefined){
                options.priority = 1;
            }

            if (this.channels[options.channel] === undefined) {

                channel = new Sy.Lib.MediatorChannel(options.channel);
                channel.setGenerator(this.generator);

                this.channels[options.channel] = channel;

            }

            return this.channels[options.channel].add(options.fn, options.context, options.priority, options.async);

        }

    },

    /**
        * Remove an element of a channel subscribers list
    */

    remove: {
        value: function (channel, id) {

            if (this.channels[channel] !== undefined) {

                this.channels[channel].remove(id);

            }

            return this;

        }

    },

    /**
        * Publish a channel
    */

    publish: {
        value: function () {

            if (arguments.length === 0) {
                return this;
            }

            var channel = Array.prototype.slice.call(arguments, 0, 1)[0],
                args = Array.prototype.slice.call(arguments, 1);

            if (this.channels[channel] !== undefined) {

                this.channels[channel].publish(args);

            }

            return this;

        }

    },

    /**
        * Pause a channel from being fired
    */

    pause: {
        value: function (channel) {

            if (this.channels[channel] !== undefined) {

                this.channels[channel].stopped = true;

            }

            return this;

        }

    },

    /**
        * Unpause a channel from being fired
    */

    unpause: {
        value: function (channel) {

            if (this.channels[channel] === undefined) {

                return;

            }

            this.channels[channel].stopped = false;

        }

    },

    /**
        * Say if a channel is paused or not
    */

    paused: {
        value: function (channel) {

            if (this.channels[channel] === undefined) {

                return;

            }

            return this.channels[channel].stopped;

        }

    },

    setGenerator: {
        value: function (object) {

            if (!(object instanceof Sy.Lib.Generator.Interface)) {
                throw 'Invalid generator';
            }

            this.generator = object;

            return this;

        }
    }

});

/**
    * Channel object to be instanciated every time a new channel is created
*/

Sy.Lib.MediatorChannel = function (name){

    this.name = name || '';
    this.stopped = false;
    this.subscribers = {};
    this.generator = null;

};

/**
    * Channel object prototype
*/

Sy.Lib.MediatorChannel.prototype = Object.create(Object.prototype, {

    /**
        * Add a subscriber to the channel
    */

    add: {
        value: function (fn, context, priority, async) {

            var guid = this.generator.generate();

            this.subscribers[guid] = {
                fn: fn,
                context: context || window,
                priority: priority || 1,
                async: async || true
            };

            return guid;

        }

    },

    /**
        * Remove an element of the subscribers list
    */

    remove: {
        value: function (id) {

            delete this.subscribers[id];

            return this;

        }

    },

    /**
        * Call every subscribers function when a channel is published
    */

    publish: {
        value: function (args) {

            var args = args || [];

            if (this.stopped === false) {

                var fns = [];

                for (var s in this.subscribers) {

                    if (this.subscribers.hasOwnProperty(s)) {

                        fns.push(this.subscribers[s]);

                    }

                }

                fns.sort(function(a, b) {
                    return a.priority - b.priority;
                });

                for (var i = 0, l = fns.length; i < l; i++) {

                    try {

                        var subscriber = fns[i];

                        if (subscriber.async === true) {
                            setTimeout(
                                this.subscriberCall,
                                0,
                                subscriber.fn,
                                subscriber.context,
                                args
                            );
                        } else {
                            this.subscriberCall(
                                subscriber.fn,
                                subscriber.context,
                                args
                            );
                        }

                    } catch (error) {

                        console.log(error);

                    }

                }

            }

            return this;

        }

    },

    setGenerator: {
        value: function (object) {

            this.generator = object;

            return this;

        }
    },

    subscriberCall: {
        value: function (fn, context, args) {

            fn.apply(context, args);

        }
    }

});