Mod.DOM = (function() {
    //= require "events"

    function DOM() {
        this.cache = {};
    }

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

    DOM.prototype.add_event = function(element, type, fn, capture) {
        if (is_string(element)) {
            element = this.cache[element];
        }

        add_event(element, type, fn, capture);
    };

    DOM.prototype.remove_event = function(element, type, fn, capture) {
        if (is_string(element)) {
            element = this.cache[element];
        }

        add_event(element, type, fn, capture);
    };
})();