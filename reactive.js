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
            var fCont = f.toString();
            f.toString = function () { return "id (" + f.id + ")"; };
            // console.log("Wrapped", fCont, "as", f["id"]);
            var wrapped = function () {
                // console.log("{", f.toString());
                var wasCalling = _this.nowCalling;
                if (wasCalling) {
                    f.deps[wasCalling.id] = wasCalling;
                }
                _this.nowCalling = f;
                // Real call is performed here
                // console.log("Calling", f.toString(), "( callers:", Object.keys(f['deps']).join(", "), ")");
                var res = f();
                _this.nowCalling = wasCalling;
                if (f.val !== res) {
                    // console.log(f.toString(), f.val, "=>", res);
                    f.val = res;
                    if (!_this.init) {
                        // console.log("Recall", Object.keys(f['deps']).join(", "));
                        var deps = f.deps; // Save dependencies
                        f.deps = {}; // Drop current dependencies. They will be re-filled during the next loop
                        for (var wr in deps) {
                            var toCall = deps[wr];
                            // console.log("Need to recall>", wr, toCall.toString());
                            toCall.wrapper();
                        }
                    }
                }
                // console.log("}", f.toString());
                return res;
            };
            f.wrapper = wrapped;
            wrapped.toString = function () { return "Wrapped " + f.toString(); };
            wrapped["f"] = f;
            wrapped["value"] = function () { return f.val; };
            this.all.push(wrapped);
            return wrapped;
        };
        World.prototype.rerequest = function (who) {
            who();
        };
        World.prototype.go = function () {
            this.init = true;
            for (var _i = 0, _a = this.all.reverse(); _i < _a.length; _i++) {
                var wr = _a[_i];
                this.rerequest(wr);
            }
            this.init = false;
            // Let's run the whole world
        };
        return World;
    })();
    Re.World = World;
    ;
})(Re || (Re = {}));
//# sourceMappingURL=reactive.js.map