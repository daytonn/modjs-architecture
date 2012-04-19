//## Mod.DOM

// This object serves as an API to interacting with the dom and cacheing selected elements.
Mod.DOM = (function() {

    // Set variables for a setInterval function and a queue to store methods to call when ready.
    var timer,
        queue = [];

    // Set a `cache` property to store selected elements and an `is_ready` property to determine DOM status.
    function DOM() {
        this.cache = {};
        this.is_ready = false;
    }

    //### add_event
    // Convenience method to attach events
    DOM.prototype.add_event = function(element, type, fn, capture) {
        if (is_undefined(capture)) {
            capture = false;
        }

        if (is_string(element)) {
            element = this.cache[element];
        }

        element.addEventListener(type, fn, capture);
    };

    //### remove_event
    // Convenience method to remove events
    DOM.prototype.remove_event = function(element, type, fn, capture) {
        if (is_undefined(capture)) {
            capture = false;
        }

        if (is_string(element)) {
            element = this.cache[element];
        }

        element.removeEventListener(type, fn, capture);
    };

    //### call_when_ready
    // Pass a function to call when the DOM is ready
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

    //### execute_ready_queue
    // Execute all methods in the `queue`
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

    //### add_elements
    // Add cached elements to the `DOM.cache` from an object of name/value pairs containing selected DOM elements
    DOM.prototype.add_elements = function(elements) {
        for(var key in elements) {
            if (elements.hasOwnProperty(key)) {
                this.add_element(key, elements[key]);
            }
        }
    };

    //### add_element
    // Add a single element to the `DOM.cache`
    DOM.prototype.add_element = function(key, element) {
        this.cache[key] = element;
    };

    return DOM;
})();