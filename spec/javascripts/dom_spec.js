describe("Mod.DOM", function() {
    var dom;

    beforeEach(function() {
        dom = new Mod.DOM;
    });

    it("should have a cache", function() {
        expect(dom.cache).toEqual({});
    });

    it("should have an is_ready property", function() {
        expect(isBool(dom.is_ready)).toBeTruthy();
    });

    it("should add an element to the cache", function() {
        dom.addElement('foo', document.getElementById('body'));
        expect(dom.cache.foo).toEqual(document.getElementById('body'));
    });

    it("should add a hash of elements to the cache", function() {
        dom.addElements({
            bar: document.getElementsByTagName('html')[0],
            baz: document.getElementsByTagName('head')[0]
        });

        expect(dom.cache.bar).toEqual(document.getElementsByTagName('html')[0]);
        expect(dom.cache.baz).toEqual(document.getElementsByTagName('head')[0]);
    });

    it("should have an addEvent method", function() {
        expect(dom.addEvent).toBeTruthy();
    });

    it("should have a removeEvent method", function() {
        expect(dom.removeEvent).toBeTruthy();
    });

    it("should have a callWhenReady method", function() {
        dom.callWhenReady(function() {
            var body = document.getElementsByTagName('body')[0],
                h1 = document.createElement('h1');

                h1.setAttribute('id', 'foo');
                body.appendChild(h1);
                expect(document.getElementById('foo')).toBeTruthy();
        });
    });
});