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
            f["toString"] = function () { return f["id"]; };
            console.log("Wrapped", fCont, "as", f["id"]);
            f["deps"] = [];
            var wrapped = function () {
                var wasCalling = _this.nowCallling;
                if (wasCalling) {
                    f["deps"].push(wasCalling);
                }
                _this.nowCallling = f;
                console.log(wasCalling, "calls", _this.nowCallling);
                var res = f();
                _this.nowCallling = wasCalling;
                if (f["val"] !== res) {
                    console.log(f, "has a new val", res);
                    f["val"] = res;
                    if (!_this.init) {
                        setTimeout(function () {
                            for (var _i = 0, _a = f['deps']; _i < _a.length; _i++) {
                                var wr = _a[_i];
                                wr['wrapper']();
                            }
                        }, 1);
                    }
                }
                return res;
            };
            f["wrapper"] = wrapped;
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