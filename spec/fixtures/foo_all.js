(function(app) {
    var m = app.addModule("foo_all");

    //= require "../elements/foo_all.elements"

    //= require "../models/foo_all.model"

    m.init = function() {
        
    };

    m.initWhenReady();

})(myapp);