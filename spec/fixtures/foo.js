(function(app) {
    var m = app.add_module("foo");

    m.init = function() {
        return this;
    };

    m.init_when_ready();

})(myapp);