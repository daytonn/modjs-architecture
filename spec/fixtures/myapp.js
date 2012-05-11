is_defined = function(suspect) {
  return typeof suspect == "undefined" ? false : true;
};

is_undefined = function(suspect) {
  return typeof suspect == "undefined" ? true : false;
};

is_typeof = function(type, suspect) {
  if (is_undefined(type)) {
    throw new Error("is_typeof(Type, suspect): type is undefined");
  }

  if (is_undefined(suspect)) {
    throw new Error("is_typeof(Type, suspect): suspect is undefined");
  }

  return suspect.constructor == type ? true : false;
};

is_numeric = function(suspect) {
  if (isNaN(suspect)) {
    return false;
  }
  return !isNaN(parseFloat(suspect)) && isFinite(suspect);
};

is_string = function(suspect) {
  return is_typeof(String, suspect);
};

is_array = function(suspect) {
  return is_typeof(Array, suspect);
};

is_number = function(suspect) {
  return is_typeof(Number, suspect);
};

is_date = function(suspect) {
  return is_typeof(Date, suspect);
};

is_bool = function(suspect) {
  return is_typeof(Boolean, suspect);
};

is_regex = function(suspect) {
  return is_typeof(RegExp, suspect);
};

is_empty = function(suspect) {
  if (is_undefined(suspect)) {
    return true;
  }

  return suspect.length === 0;
};

is_not_empty = function(suspect) {
  return suspect.length >= 1;
};
if (!Element.prototype.addEventListener) {
    var oListeners = {};

    function runListeners(oEvent) {
        if (!oEvent) {
            oEvent = window.event;
        }

        for (var iLstId = 0, iElId = 0, oEvtListeners = oListeners[oEvent.type]; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === this) {
                for (iLstId; iLstId < oEvtListeners.aEvts[iElId].length; iLstId++) {
                    oEvtListeners.aEvts[iElId][iLstId].call(this, oEvent);
                }

                break;
            }
        }
    }

    Element.prototype.addEventListener = function (sEventType, fListener) {
        if (oListeners.hasOwnProperty(sEventType)) {
            var oEvtListeners = oListeners[sEventType];

            for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
                if (oEvtListeners.aEls[iElId] === this) {
                    nElIdx = iElId; break;
                }
            }

            if (nElIdx === -1) {
                oEvtListeners.aEls.push(this);
                oEvtListeners.aEvts.push([fListener]);
                this["on" + sEventType] = runListeners;
            }
            else {
                var aElListeners = oEvtListeners.aEvts[nElIdx];

                if (this["on" + sEventType] !== runListeners) {
                    aElListeners.splice(0);
                    this["on" + sEventType] = runListeners;
                }

                for (var iLstId = 0; iLstId < aElListeners.length; iLstId++) {
                    if (aElListeners[iLstId] === fListener) {
                        return;
                    }
                }

                aElListeners.push(fListener);
            }
        }
        else {
            oListeners[sEventType] = {
                aEls: [this],
                aEvts: [[fListener]]
            };

            this["on" + sEventType] = runListeners;
        }
    };

    Element.prototype.removeEventListener = function (sEventType) {
        if (!oListeners.hasOwnProperty(sEventType)) {
            return;
        }

        var oEvtListeners = oListeners[sEventType];

        for (var nElIdx = -1, iElId = 0; iElId < oEvtListeners.aEls.length; iElId++) {
            if (oEvtListeners.aEls[iElId] === this) {
                nElIdx = iElId;
                break;
            }
        }

        if (nElIdx === -1) {
            return;
        }

        for (var iLstId = 0, aElListeners = oEvtListeners.aEvts[nElIdx]; iLstId < aElListeners.length; iLstId++) {
            aElListeners.splice(iLstId, 1);
        }
    };
}

var Mod = {};

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
        if (this.is_ready) {
            return func();
        }

        if (timer) {
            queue.push(func);
        }
        else {
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
Mod.Module = (function() {

    function Module(name) {
        if (is_undefined(name)) {
            throw new Error("Mod.Module(name): name is undefined");
        }

        this.dom = new Mod.DOM;
        this.data = {};
        this.name = name;
    }

    Module.prototype.init = function() {};

    Module.prototype.init_when_ready = function() {
        var mod = this;
        this.dom.call_when_ready(mod.init);
    };

    Module.prototype.elements = function(elements) {
        if (is_undefined(elements)) {
            return this.dom.cache;
        }

        if (is_string(elements)) {
            var name = elements;
            return this.dom.cache[name];
        }
        else {
            this.dom.add_elements(elements);
        }
    };

    Module.prototype.set_data = function(key, value) {
        if (is_undefined(key)) {
            throw new Error(this.name + '.set_data(key, value): key is undefined');
        }

        if (is_typeof(String, key) && is_undefined(value)) {
            throw new SyntaxError(this.name + 'Module.set_data(key, value): value is undefined');
        }

        if (is_typeof(String, key)) {
            this.data[key] = value;
        }
        else if (is_typeof(Object, key)) {
            var data = key;
            for(var property in data) {
                this.data[property] = data[property];
            }
        }

        return this;
    };

    return Module;
})();
Mod.Application = (function() {

    function Application(name) {
        if (is_undefined(name)) {
            throw new Error("new Mod.Application(name): name is undefined");
        }

        this.name = name;
    }

    Application.prototype.add_module = function(name) {
        if (is_undefined(name)) {
            throw new Error("Mod.Application.add_module(name): name is undefined");
        }

        if (is_defined(this[name])) {
            throw new Error("Mod.Application.add_module('" + name + "'): '" + name + "' already declared");
        }

        if (this.name === name) {
            throw new Error("Mod.Application.add_module('" + name + "'): a module cannot have the same name as the application. It's bad idea. Do you really want to write " + name + "." + name + "? It's confusing.'");
        }

        return this[name] = new Mod.Module(name);
    };

    return Application;
})();

var myapp = new Mod.Application('myapp');