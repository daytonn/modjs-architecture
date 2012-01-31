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

var Mod = {};

Mod.DOM = (function() {
function add_event(element, type, fn, capture) {
    if (!capture) {
        capture = false;
    }

    if (element.add_eventListener) {
        element.add_eventListener(type, fn, capture);
    }
    else {
        if (capture) {
            throw new Error('add_event(element, type, fn, capture): This browser does not support event capturing');
        }
        else {
            var type_ref = '__' + type;

            if (element[type_ref]) {
                if (array_search(fn, element[type_ref]) > -1) {
                    return;
                }
            }
            else {
                element[type_ref] = [];

                if (element['on' + type]) {
                    element[type_ref][0] = element['on' + type];
                }

                element['on' + type] = IE_event_handler;
            }

            element[type_ref][element[type_ref].length] = fn;
        }
    }
}

function remove_event(element, type, fn, capture) {
    if (!capture) {
        capture = false;
    }

    if (element.remove_eventListener) {
        element.remove_eventListener(type, fn, capture);
    }
    else {
        var type_ref = '__' + type;

        if (element[type_ref]) {
            var i = array_search(fn, element[type_ref]);
            if (i > -1) {
                try {
                    delete element[type_ref][i];
                }
                catch(e) {
                    element[type_ref][i] = null;
                }
            }
        }
    }
}

function IE_event_handler(e) {
    e = e || window.event;
    var type_ref = '__' + e.type,
        retValue = true;

    for (var i = 0, j = this[type_ref].length; i < j; i++) {
        if (this[type_ref][i]) {
            if (Function.call) {
                retValue = this[type_ref][i].call(this, e) && retValue;
            }
            else {
                this.__fn = this[type_ref][i];
                retValue = this.__fn(e) && retValue;
            }
        }
    }

    if (this.__fn) {
        try {
            delete this.__fn;
        }
        catch(e) {
            this.__fn = null;
        }
    }

    return retValue;
}

function array_search(val, arr) {
    var i = arr.length;

    while (i--) {
        if (arr[i] && arr[i] === val) {
            break;
        }
    }

    return i;
}

    return function() {
        var timer,
            queue = [];

        this.cache = {};
        this.is_ready = false;

        this.call_when_ready = function(func) {
            if (is_ready) {
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
Mod.Module = (function() {

    function Module(name) {
        if (is_undefined(name)) {
            throw new Error("Mod.Module(name): name is undefined");
        }

        this.dom = new Mod.DOM;
        this.data = {};
        this.name = name;
    }

    Module.prototype.actions = function() {};

    Module.prototype.run = function() {
        var mod = this;
        this.dom.call_when_ready(function() {
            mod.execute();
        });
    };

    Module.prototype.execute = function() {
        this.actions();
    };

    Module.prototype.elements = function(elements) {
        if (is_undefined(elements)) {
            throw new Error(this.name + ".elements(name/elements): name or elements is undefined");
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

        this.name = name
    };

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
