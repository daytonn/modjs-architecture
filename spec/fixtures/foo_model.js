(function(app) {
    var m = app.addModule("foo_model");

    //= require "../models/foo_model.model"

    m.init = function() {
        
    };

    m.initWhenReady();

})(myapp);