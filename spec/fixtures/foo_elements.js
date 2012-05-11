(function(app) {
    var m = app.add_module("foo_elements");

    //= require "../elements/foo_elements.elements"

    m.init = function() {
        return this;
    };

    m.init_when_ready();

})(myapp);