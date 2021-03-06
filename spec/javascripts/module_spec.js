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

    it("should add data with setData", function() {
        module.setData({
            one: 'one',
            two: 'two'
        });
        module.setData('three', 'three');
        expect(module.data.one).toEqual('one');
        expect(module.data.two).toEqual('two');
        expect(module.data.three).toEqual('three');
    });

    it("should have an init method", function() {
        expect(module.init).toBeTruthy();
    });

    it("should have an elements method to cache DOM elements", function() {
        module.elements({
            body: document.getElementsByTagName('body')[0],
            jasmine_content: document.getElementById('jasmine_content')
        });
        expect(module.elements('body')).toEqual(document.getElementsByTagName('body')[0]);
        expect(module.elements('jasmine_content')).toEqual(document.getElementById('jasmine_content'));
    });

    it("should get all the elements", function() {
        module.elements({
            body: document.getElementsByTagName('body')[0],
            jasmine_content: document.getElementById('jasmine_content')
        });
        expect(module.elements()).toEqual({
            body: document.getElementsByTagName('body')[0],
            jasmine_content: document.getElementById('jasmine_content')
        });
    });

    it("should run the execute method when the dom is ready", function() {
        module.init = function() {
            this.setData('init_did_run', true);
            expect(module.data.init_did_run).toBeTruthy();
        };

        module.initWhenReady();
    });
});