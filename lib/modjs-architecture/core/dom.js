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

    //### addEvent
    // Convenience method to attach events
    DOM.prototype.addEvent = function(element, type, fn, capture) {
        if (isUndefined(capture)) {
            capture = false;
        }

        if (isString(element)) {
            element = this.cache[element];
        }

        element.addEventListener(type, fn, capture);
    };

    //### removeEvent
    // Convenience method to remove events
    DOM.prototype.removeEvent = function(element, type, fn, capture) {
        if (isUndefined(capture)) {
            capture = false;
        }

        if (isString(element)) {
            element = this.cache[element];
        }

        element.removeEventListener(type, fn, capture);
    };

    //### callWhenReady
    // Pass a function to call when the DOM is ready
    DOM.prototype.callWhenReady = function(func) {
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
            this.addEvent(window, 'load', this.executeReadyQueue);
            queue.push(func);
            timer = setInterval(this.executeReadyQueue, 13);
        }
    };

    //### executeReadyQueue
    // Execute all methods in the `queue`
    DOM.prototype.executeReadyQueue = function() {
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

    //### addElements
    // Add cached elements to the `DOM.cache` from an object of name/value pairs containing selected DOM elements
    DOM.prototype.addElements = function(elements) {
        for(var key in elements) {
            if (elements.hasOwnProperty(key)) {
                this.addElement(key, elements[key]);
            }
        }
    };

    //### addElement
    // Add a single element to the `DOM.cache`
    DOM.prototype.addElement = function(key, element) {
        this.cache[key] = element;
    };

    return DOM;
})();