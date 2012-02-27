(function(app) {
    var m = app.add_module("<%= arguments[1] %>");
<% if options[:e] %>

    //= require "../elements/<%= arguments[1] %>.elements"
<% end %>
<% if options[:m] %>

    //= require "../models/<%= arguments[1] %>.model"
<% end %>

    m.actions = function() {
        
    }

    m.run();
})(<%= blueprint[:name] %>);