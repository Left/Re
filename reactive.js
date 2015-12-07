var Re;
(function (Re) {
    var Processors = (function () {
        function Processors() {
            this.nextId = 0;
            this.all = [];
        }
        Processors.prototype.wrap = function (f) {
            var _this = this;
            f["id"] = ++(this.nextId);
            f["deps"] = {};
            var fCont = f.toString();
            f.toString = function () { return "id " + f["id"]; };
            // console.log("Wrapped", fCont, "as", f["id"]);
            var wrapped = function () {
                // console.log("{", f.toString());
                var wasCalling = _this.nowCalling;
                if (wasCalling) {
                    f["deps"][wasCalling["id"]] = wasCalling;
                }
                _this.nowCalling = f;
                // Real call here
                // console.log("Calling", f.toString(), "( callers:", Object.keys(f['deps']).join(", "), ")");
                var res = f();
                _this.nowCalling = wasCalling;
                if (f["val"] !== res) {
                    // console.log(f.toString(), "has a new val", res);
                    f["val"] = res;
                    if (!_this.init) {
                        setTimeout(function () {
                            if (wasCalling) {
                                wasCalling['wrapper']();
                            }
                            // console.log("Recall", Object.keys(f['deps']).join(", "));
                            for (var wr in f['deps']) {
                                var toCall = f['deps'][wr];
                                // console.log("Need to recall>", wr, toCall.toString(), toCall["wrapper"].toString());
                                toCall["wrapper"]();
                            }
                        }, 100);
                    }
                }
                // console.log("}", f.toString());
                return res;
            };
            f["wrapper"] = wrapped;
            wrapped.toString = function () { return "Wrapped " + f.toString(); };
            this.all.push(wrapped);
            return wrapped;
        };
        Processors.prototype.rerequest = function (who) {
            who();
        };
        Processors.prototype.go = function () {
            this.init = true;
            for (var _i = 0, _a = this.all.reverse(); _i < _a.length; _i++) {
                var wr = _a[_i];
                this.rerequest(wr);
            }
            this.init = false;
            // Let's run the whole world
        };
        return Processors;
    })();
    Re.Processors = Processors;
    ;
})(Re || (Re = {}));
//# sourceMappingURL=reactive.js.map