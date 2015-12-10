/// <reference path="reactive.ts"/>
document.addEventListener("DOMContentLoaded", function () {
    var w = new Re.World();
    var MouseBtn;
    (function (MouseBtn) {
        MouseBtn[MouseBtn["NONE"] = 0] = "NONE";
        MouseBtn[MouseBtn["LEFT"] = 1] = "LEFT";
        MouseBtn[MouseBtn["MIDDLE"] = 2] = "MIDDLE";
        MouseBtn[MouseBtn["RIGHT"] = 3] = "RIGHT";
    })(MouseBtn || (MouseBtn = {}));
    ;
    var firstTs = null;
    function mouseLastSnapShot(w, event) {
        var lastMousePos = { x: null, y: null, ts: null, btn: null };
        window.addEventListener(event, function (ev) {
            var e = ev;
            lastMousePos.x = e.x;
            lastMousePos.y = e.y;
            lastMousePos.ts = e.timeStamp;
            lastMousePos.btn = e.which;
            if (firstTs === null) {
                firstTs = e.timeStamp;
            }
            newVar.x();
            newVar.y();
            newVar.ts();
        });
        var newVar = {
            x: w.wrap(function () { return lastMousePos.x; }),
            y: w.wrap(function () { return lastMousePos.y; }),
            btn: w.wrap(function () { return lastMousePos.btn; }),
            ts: w.wrap(function () { return lastMousePos.ts - firstTs; })
        };
        return newVar;
    }
    var mouseMove = mouseLastSnapShot(w, "mousemove");
    var mouseDown = mouseLastSnapShot(w, "mousedown");
    var mouseUp = mouseLastSnapShot(w, "mouseup");
    var lastDrag = w.wrap(function () {
        if (mouseDown.ts() >= mouseUp.ts()) {
            return Math.sqrt(Math.pow(mouseUp.x() - mouseDown.x(), 2) + Math.pow(mouseUp.y() - mouseDown.y(), 2));
        }
        else {
            return 0;
        }
    });
    var cnv = document.getElementById("cnv");
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
    cnv.style.position = "fixed";
    cnv.style.left = 0 + "px";
    cnv.style.top = 0 + "px";
    // var context2 = cnv.getContext("2d");
    // context2.fillStyle = "rgb(40,40,40)";
    // context2.fillRect(0, 0, window.innerWidth, window.innerHeight);
    w.wrap(function () {
        var downx = mouseDown.x();
        var upx = mouseUp.x();
        if (!downx || !upx) {
            return;
        }
        var doyny = mouseDown.y();
        var upy = mouseUp.y();
        // console.log(mouseDown.ts(), mouseDown.x() + "," + mouseDown.y(),
        //    mouseUp.ts(), mouseUp.x() + "," + mouseUp.y());
        if (mouseUp.ts() >= mouseDown.ts()) {
            // console.trace();
            // console.log("Draw!", downx, doyny, upx, upy);
            var context = cnv.getContext("2d");
            context.fillStyle = "red";
            // context.fillRect(mouseDown.x() - 1, mouseDown.y() - 1, 2, 2);
            // context.fillText(downx + "," + doyny, downx, doyny);
            context.fillStyle = "blue";
            // context.fillText(upx + "," + upy, upx, upy);
            context.lineWidth = 1;
            context.strokeStyle = "green";
            context.beginPath();
            context.moveTo(downx, doyny);
            context.lineTo(upx, upy);
            context.stroke();
        }
    });
    w.go();
});
//# sourceMappingURL=canvas.js.map