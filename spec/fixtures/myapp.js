isDefined = function(suspect) {
  return typeof suspect == "undefined" ? false : true;
};

isUndefined = function(suspect) {
  return typeof suspect == "undefined" ? true : false;
};

isTypeof = function(type, suspect) {
  if (isUndefined(type)) {
    throw new Error("isTypeof(Type, suspect): type is undefined");
  }

  if (isUndefined(suspect)) {
    throw new Error("isTypeof(Type, suspect): suspect is undefined");
  }

  return suspect.constructor == type ? true : false;
};

isNumeric = function(suspect) {
  if (isNaN(suspect)) {
    return false;
  }
  return !isNaN(parseFloat(suspect)) && isFinite(suspect);
};

isString = function(suspect) {
  return isTypeof(String, suspect);
};

isArray = function(suspect) {
  return isTypeof(Array, suspect);
};

isNumber = function(suspect) {
  return isTypeof(Number, suspect);
};

isDate = function(suspect) {
  return isTypeof(Date, suspect);
};

is_bool = function(suspect) {
  return isTypeof(Boolean, suspect);
};

isRegExp = function(suspect) {
  return isTypeof(RegExp, suspect);
};

isEmpty = function(suspect) {
  if (isUndefined(suspect)) {
    return true;
  }

  return suspect.length === 0;
};

isNotEmpty = function(suspect) {
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

    DOM.prototype.addEvent = function(element, type, fn, capture) {
        if (isUndefined(capture)) {
            capture = false;
        }

        if (isString(element)) {
            element = this.cache[element];
        }

        element.addEventListener(type, fn, capture);
    };

    DOM.prototype.removeEvent = function(element, type, fn, capture) {
        if (isUndefined(capture)) {
            capture = false;
        }

        if (isString(element)) {
            element = this.cache[element];
        }

        element.removeEventListener(type, fn, capture);
    };

    DOM.prototype.callWhenReady = function(func) {
        if (this.is_ready) {
            return func();
        }

        if (timer) {
            queue.push(func);
        }
        else {
            this.addEvent(window, 'load', this.executeReadyQueue);
            queue.push(func);
            timer = setInterval(this.executeReadyQueue, 13);
        }
    };

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

    DOM.prototype.addElements = function(elements) {
        for(var key in elements) {
            if (elements.hasOwnProperty(key)) {
                this.addElement(key, elements[key]);
            }
        }
    };

    DOM.prototype.addElement = function(key, element) {
        this.cache[key] = element;
    };

    return DOM;
})();
Mod.Module = (function() {

    function Module(name) {
        if (isUndefined(name)) {
            throw new Error("Mod.Module(name): name is undefined");
        }

        this.dom = new Mod.DOM;
        this.data = {};
        this.name = name;
    }

    Module.prototype.init = function() {};

    Module.prototype.initWhenReady = function() {
        var mod = this;
        this.dom.callWhenReady(mod.init);
    };

    Module.prototype.elements = function(elements) {
        if (isUndefined(elements)) {
            return this.dom.cache;
        }

        if (isString(elements)) {
            var name = elements;
            return this.dom.cache[name];
        }
        else {
            this.dom.addElements(elements);
        }
    };

    Module.prototype.setData = function(key, value) {
        if (isUndefined(key)) {
            throw new Error(this.name + '.setData(key, value): key is undefined');
        }

        if (isTypeof(String, key) && isUndefined(value)) {
            throw new SyntaxError(this.name + 'Module.setData(key, value): value is undefined');
        }

        if (isTypeof(String, key)) {
            this.data[key] = value;
        }
        else if (isTypeof(Object, key)) {
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
        if (isUndefined(name)) {
            throw new Error("new Mod.Application(name): name is undefined");
        }

        this.name = name;
    }

    Application.prototype.addModule = function(name) {
        if (isUndefined(name)) {
            throw new Error("Mod.Application.addModule(name): name is undefined");
        }

        if (isDefined(this[name])) {
            throw new Error("Mod.Application.addModule('" + name + "'): '" + name + "' already declared");
        }

        if (this.name === name) {
            throw new Error("Mod.Application.addModule('" + name + "'): a module cannot have the same name as the application. It's bad idea. Do you really want to write " + name + "." + name + "? It's confusing.'");
        }

        return this[name] = new Mod.Module(name);
    };

    return Application;
})();

var myapp = new Mod.Application('myapp');