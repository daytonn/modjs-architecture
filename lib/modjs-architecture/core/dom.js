Mod.DOM = (function() {

    var timer,
        queue = [];

    function DOM() {
        this.cache = {};
        this.is_ready = false;
    }

    DOM.prototype.add_event = function(element, type, fn, capture) {
        if (is_undefined(capture)) {
            capture = false;
        }

        if (is_string(element)) {
            element = this.cache[element];
        }

        element.addEventListener(type, fn, capture);
    };

    DOM.prototype.remove_event = function(element, type, fn, capture) {
        if (is_undefined(capture)) {
            capture = false;
        }

        if (is_string(element)) {
            element = this.cache[element];
        }

        element.removeEventListener(type, fn, capture);
    };

    DOM.prototype.call_when_ready = function(func) {
        // if DOM is already loaded execute the function
        if (this.is_ready) {
            return func();
        }

        // if timer is ticking
        if (timer) {
            queue.push(func);
        }
        // this is the first in the queue
        else {
            // attach to the load event, just in case it finishes first.
            this.add_event(window, 'load', this.execute_ready_queue);
            queue.push(func);
            timer = setInterval(this.execute_ready_queue, 13);
        }
    };

    DOM.prototype.execute_ready_queue = function() {
        if (this.is_ready) {
            return false;
        }

        if (document && document.getElementsByTagName && document.getElementById && document.body) {
            clearInterval(timer);
            timer = null;
            for(var i = 0, j = queue.length; i < j; i++) {
                queue[i]();
            }

            queue = [];
            this.is_ready = true;
        }
    };

    DOM.prototype.add_elements = function(elements) {
        for(var key in elements) {
            if (elements.hasOwnProperty(key)) {
                this.add_element(key, elements[key]);
            }
        }
    };

    DOM.prototype.add_element = function(key, element) {
        this.cache[key] = element;
    };

    return DOM;
})();