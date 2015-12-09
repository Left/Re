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
            f.calls = {};
            var fCont = f.toString();
            f.toString = function () { return "id (" + f.id + ")"; };
            // console.log("Wrapped", fCont, "as", f["id"]);
            var wrapped = function () {
                // console.log("{", f.toString());
                var wasCalling = _this.nowCalling;
                if (wasCalling) {
                    f.deps[wasCalling.id] = wasCalling;
                    wasCalling.calls[f.id] = f;
                }
                _this.nowCalling = f;
                // Real call here
                // console.log("Calling", f.toString(), "( callers:", Object.keys(f['deps']).join(", "), ")");
                var res = f();
                _this.nowCalling = wasCalling;
                if (f.val !== res) {
                    // console.log(f.toString(), "has a new val", res);
                    f.val = res;
                    if (!_this.init) {
                        // setTimeout(() => {
                        // console.log("Recall", Object.keys(f['deps']).join(", "));
                        for (var wr in f.deps) {
                            var toCall = f.deps[wr];
                            // console.log("Need to recall>", wr, toCall.toString(), toCall["wrapper"].toString());
                            toCall.wrapper();
                        }
                    }
                }
                // console.log("}", f.toString());
                return res;
            };
            f.wrapper = wrapped;
            wrapped.toString = function () { return "Wrapped " + f.toString(); };
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