(function() {
  var Application = Mod.Application = function() {
    // Constructor
  };
  // add_module is a factory function to attach modules to the application object
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
