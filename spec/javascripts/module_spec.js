describe("Mod.Module", function() {
    var module;

    beforeEach(function() {
        module = new Mod.Module('foo');
    });

    it("should require a name", function() {
        expect(function() {
            var x = new Mod.Module;
        }).toThrow("Mod.Module(name): name is undefined");
    });

    it("should have a dom attribute", function() {
        expect(module.dom.constructor).toEqual(Mod.DOM);
    });

    it("should have a name attribute", function() {
        expect(module.name).toEqual('foo');
    });

    it("should have a data attribute", function() {
        expect(module.data).toEqual({});
    });

    it("should add data with set_data", function() {
        module.set_data({
            one: 'one',
            two: 'two'
        });
        module.set_data('three', 'three');
        expect(module.data.one).toEqual('one');
        expect(module.data.two).toEqual('two');
        expect(module.data.three).toEqual('three');
    });

    it("should have an actions method", function() {
        expect(module.actions).toBeTruthy();
    });

    it("should have an execute method to call the actions", function() {
        module.actions = function() {
            this.set_data('actions_did_run', true);
        };
        module.execute();
        expect(module.data.actions_did_run).toBeTruthy();
    });

    it("should have an elements method to cache DOM elements", function() {
        // Need to test DOM before this will work
    });
});