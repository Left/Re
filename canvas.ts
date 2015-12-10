/// <reference path="reactive.ts"/>

document.addEventListener("DOMContentLoaded", () => {
    const w = new Re.World();

    enum MouseBtn {
        NONE,
        LEFT,
        MIDDLE,
        RIGHT
    };

    var firstTs: number = null;
    function mouseLastSnapShot(w: Re.World, event: string) {
        const lastMousePos = {x : null, y: null, ts: null, btn: null };

        window.addEventListener(event, ev => {
            const e = <MouseEvent>ev;
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
            x: w.wrap(() => lastMousePos.x),
            y: w.wrap(() => lastMousePos.y),
            btn: w.wrap(() => lastMousePos.btn),
            ts: w.wrap(() => lastMousePos.ts - firstTs)
        };

        return newVar;
    }

    const mouseMove = mouseLastSnapShot(w, "mousemove");
    const mouseDown = mouseLastSnapShot(w, "mousedown");
    const mouseUp = mouseLastSnapShot(w, "mouseup");

    const lastDrag = w.wrap(() => {
        if (mouseDown.ts() >= mouseUp.ts()) {
            return Math.sqrt(Math.pow(mouseUp.x() - mouseDown.x(), 2) + Math.pow(mouseUp.y() - mouseDown.y(), 2));
        } else {
            return 0;
        }
    });

    const cnv = (<HTMLCanvasElement>document.getElementById("cnv"));
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
    cnv.style.position = "fixed";
    cnv.style.left = 0 + "px";
    cnv.style.top = 0 + "px";
    // var context2 = cnv.getContext("2d");
    // context2.fillStyle = "rgb(40,40,40)";
    // context2.fillRect(0, 0, window.innerWidth, window.innerHeight);

    w.wrap(() => {
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