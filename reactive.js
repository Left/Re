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
            var fCont = f.toString();
            f.toString = function () { return "id " + f["id"]; };
            console.log("Wrapped", fCont, "as", f["id"]);
            f["deps"] = [];
            var wrapped = function () {
                var wasCalling = _this.nowCalling;
                if (wasCalling) {
                    f["deps"].push(wasCalling);
                    console.log(wasCalling, "calls", f);
                }
                _this.nowCalling = f;
                if (wasCalling === _this.nowCalling) {
                    console.trace();
                    return;
                }
                var res = f();
                _this.nowCalling = wasCalling;
                if (f["val"] !== res) {
                    console.log(f, "has a new val", res);
                    f["val"] = res;
                    if (!_this.init) {
                        setTimeout(function () {
                            for (var _i = 0, _a = f['deps']; _i < _a.length; _i++) {
                                var wr = _a[_i];
                                console.log("Need to recall>", wr['wrapper']);
                            }
                        }, 1000);
                    }
                }
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