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

(function() {
  var Module = Mod.Module = function(name) {
    if (is_undefined(name)) {
      throw new Error("Mod.Module(name): name is undefined");
    }

    this.dom = new Mod.DOM(this);
    this.data = {};
    this.name = name;
  };

  Module.prototype.actions = function() {};

  Module.prototype.run = function() {
    var mod = this;
    this.dom.ready(function() {
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
      var dom = this.dom;
      dom.ready(function() {
        for(var key in elements) {
          if (elements.hasOwnProperty(key)) {
            dom.cache[key] = elements[key];
          }
        }
      });
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
})();
(function() {
  var Application = Mod.Application = function() {
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
})();
