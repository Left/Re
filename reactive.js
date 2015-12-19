var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
                    // console.log(f.toString(), f.val, "!==", res);
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
        World.prototype.makeCellArray = function () {
            var CellArray = (function (_super) {
                __extends(CellArray, _super);
                function CellArray() {
                    _super.apply(this, arguments);
                }
                CellArray.prototype.isEqual = function (o) {
                    return o && this.length === o.length;
                };
                CellArray.prototype.copy = function () {
                    var _this = this;
                    var ret = new CellArray();
                    ret.length = this.length;
                    this.forEach(function (e, i) { ret[i] = _this[i]; });
                    return ret;
                };
                return CellArray;
            })(Array);
            var arr2 = new CellArray();
            return this.wrap(function () {
                return arr2;
            });
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