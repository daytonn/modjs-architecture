Mod.DOM = (function() {
    //= require "events"

    return function() {
        var timer,
            queue = [];

        this.cache = {};
        this.is_ready = false;

        this.call_when_ready = function(func) {
            // if DOM is already loaded execute the function
            if (is_ready) {
                return func();
            }

            // if timer is ticking
            if (timer) {
                queue.push(func);
            }
            // this is the first in the queue
            else {
                // attach to the load event
                // just in case it finishes first.
                this.add_event(window, 'load', this.execute_ready_queue);
                queue.push(func);
                timer = setInterval(this.execute_ready_queue, 13);
            }
        };

        this.execute_ready_queue = function() {
            if (is_ready) {
                return false;
            }

            if (document && document.getElementsByTagName && document.getElementById && document.body) {
                clearInterval(timer);
                timer = null;
                var length = queue.length;
                for(var i = 0; i < length; i++) {
                    queue[i]();
                }

                queue = [];
                this.is_ready = true;
            }
        };

        this.add_elements = function(elements) {
            this.call_when_ready(function() {
                for(var key in elements) {
                    if (elements.hasOwnProperty(key)) {
                        this.cache[key] = elements[key];
                    }
                }
            });
        };

        this.add_event = add_event;
        this.remove_event = remove_event;
    }
})();