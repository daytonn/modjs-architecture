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

        // Look up cached element by string key
        if (is_string(elements)) {
            var name = elements;
            return this.dom.cache[name];
        }
        // cache the DOM objects
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
