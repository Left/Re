/// <reference path="reactive.ts"/>
document.addEventListener("DOMContentLoaded", function () {
    var w = new Re.World();
    function dataFromInput(id) {
        var ret = w.wrap(function () {
            return document.getElementById(id).value;
        });
        document.getElementById(id).addEventListener('input', function (e) {
            ret();
        });
        return ret;
    }
    var cellInput = dataFromInput("inp");
    var cellInput2 = dataFromInput("inp2");
    var timer = w.wrap(function () {
        return (new Date()).toString();
    });
    setInterval(timer, 25);
    function mouseLastSnapShot(w, event) {
        var lastMousePos = { x: null, y: null, ts: null, firstTs: null };
        window.addEventListener(event, function (ev) {
            var e = ev;
            lastMousePos.x = e.x;
            lastMousePos.y = e.y;
            lastMousePos.ts = e.timeStamp;
            if (lastMousePos.firstTs === null) {
                lastMousePos.firstTs = e.timeStamp;
            }
        });
        return {
            x: w.wrap(function () { return lastMousePos.x; }),
            y: w.wrap(function () { return lastMousePos.y; }),
            ts: w.wrap(function () {
                // console.log(lastMousePos.ts - lastMousePos.firstTs);
                return lastMousePos.ts - lastMousePos.firstTs;
            })
        };
    }
    var mouseMove = mouseLastSnapShot(w, "mousemove");
    var mouseDown = mouseLastSnapShot(w, "mousedown");
    var mouseUp = mouseLastSnapShot(w, "mouseup");
    var lastDrag = w.wrap(function () {
        // console.log(mouseUp.ts(), mouseDown.ts());
        if (mouseUp.ts() >= mouseDown.ts()) {
            return Math.sqrt(Math.pow(mouseUp.x() - mouseDown.x(), 2) + Math.pow(mouseUp.y() - mouseDown.y(), 2));
        }
        else {
            return 0;
        }
    });
    var cellProcessor = w.wrap(function () {
        //
        return "[" + cellInput() + " " + cellInput2() + " " +
            timer() +
            " " + lastDrag() + "]";
    });
    var cnv = document.getElementById("cnv");
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight - 100;
    cnv.style.position = "fixed";
    cnv.style.left = 0 + "px";
    cnv.style.top = 100 + "px";
    w.wrap(function () {
        var downx = mouseDown.x();
        var doyny = mouseDown.y() - 100;
        var upx = mouseUp.x();
        var upy = mouseUp.y() - 100;
        if (!downx || !doyny || !upx || !upy) {
            return;
        }
        console.trace();
        console.log("Draw!", downx, doyny, upx, upy);
        var context = cnv.getContext("2d");
        context.fillStyle = "red";
        // context.fillRect(mouseDown.x() - 1, mouseDown.y() - 1, 2, 2);
        context.fillText(downx + "," + doyny, downx, doyny);
        context.fillStyle = "blue";
        context.fillText(upx + "," + upy, upx, upy);
        context.lineWidth = 1;
        context.strokeStyle = "green";
        context.beginPath();
        context.moveTo(downx, doyny);
        context.lineTo(upx, upy);
        context.stroke();
    });
    w.wrap(function () {
        document.getElementById("res").innerText = cellProcessor();
        return null;
    });
    w.go();
});
//# sourceMappingURL=test.js.map