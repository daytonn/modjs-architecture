(function(app) {
    var m = app.add_module("foo_model");

    //= require "../models/foo_model.model"

    m.init = function() {
        return this;
    };

    m.init_when_ready();

})(myapp);