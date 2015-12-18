var Re;
(function (Re) {
    var World = (function () {
        function World() {
            this.nextId = 0;
            this.all = [];
        }
        World.prototype.wrap = function (fPar) {
            var _this = this;
            var f = fPar;
            f.id = ++(this.nextId);
            f.deps = {};
            f.initialized = false;
            var fCont = f.toString();
            f.toString = function () { return "id (" + f.id + ")"; };
            // console.log("Wrapped", fCont, "as", f["id"]);
            var wrapped = function () {
                // console.log("{", f.toString());
                var wasCalling = _this.nowCalling;
                if (wasCalling) {
                    f.deps[wasCalling.id] = wasCalling;
                    console.log(wasCalling.toString(), "calls", f.toString());
                }
                _this.nowCalling = f;
                // Real call is performed here
                // console.log("Calling", f.toString(), "( callers:", Object.keys(f['deps']).join(", "), ")");
                var res = f();
                f.initialized = true;
                _this.nowCalling = wasCalling;
                if (((typeof res === "object" && res != null) ?
                    !(res.isEqual((f.val))) :
                    f.val !== res)) {
                    console.log(f.toString(), f.val, "!==", res);
                    // console.log("Recall", Object.keys(f['deps']).join(", "));
                    if (typeof res === "object" && res != null) {
                        f.val = res.copy();
                        if (!res.isEqual((f.val))) {
                            console.trace();
                        }
                    }
                    else {
                        f.val = res;
                    }
                    var deps = f.deps; // Save dependencies
                    f.deps = {}; // Drop current dependencies. They will be re-filled during the next loop
                    for (var wr in deps) {
                        var toCall = deps[wr];
                        // console.log("Need to recall>", wr, toCall.toString());
                        toCall.wrapper();
                    }
                }
                else {
                    console.log(f.toString(), f.val, "===", res);
                }
                // console.log("}", f.toString());
                return res;
            };
            f.wrapper = wrapped;
            wrapped.toString = function () { return "Wrapped " + f.toString(); };
            wrapped["f"] = f;
            // wrapped["value"] = () => f.val;
            this.all.push(f);
            return wrapped;
        };
        World.prototype.go = function () {
            var _this = this;
            console.log("Initializing");
            // Let's run the whole world
            var callUninitialized = function () {
                for (var i = _this.all.length - 1; i >= 0; --i) {
                    if (!_this.all[i].initialized) {
                        _this.all[i].wrapper();
                        callUninitialized();
                    }
                }
            };
            callUninitialized();
            console.log("Initializing done");
        };
        return World;
    })();
    Re.World = World;
    ;
})(Re || (Re = {}));
//# sourceMappingURL=reactive.js.map