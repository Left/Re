/// <reference path="reactive.ts"/>

document.addEventListener("DOMContentLoaded", () => {
    const w = new Re.World();

    function dataFromInput(id) {
        const ret = w.wrap(() => {
            return (<HTMLInputElement>document.getElementById(id)).value;
        });

        document.getElementById(id).addEventListener('input', (e) => {
            ret();
        });

        return ret;
    }

    const cellInput = dataFromInput("inp");
    const cellInput2 = dataFromInput("inp2");

    const timer = w.wrap(() => {
        return (new Date()).toString();
    });
    setInterval(timer, 25);

    function mouseLastSnapShot(w: Re.World, event: string) {
        const lastMousePos = {x : null, y: null, ts: null, firstTs: null};
        window.addEventListener(event, ev => {
            const e = <MouseEvent>ev;
            lastMousePos.x = e.x;
            lastMousePos.y = e.y;
            lastMousePos.ts = e.timeStamp;
            if (lastMousePos.firstTs === null) {
                lastMousePos.firstTs = e.timeStamp;
            }
        });

        return {
            x: w.wrap(() => lastMousePos.x),
            y: w.wrap(() => lastMousePos.y),
            ts: w.wrap(() => {
                // console.log(lastMousePos.ts - lastMousePos.firstTs);
                return lastMousePos.ts - lastMousePos.firstTs
            })
        };
    }

    const mouseMove = mouseLastSnapShot(w, "mousemove");
    const mouseDown = mouseLastSnapShot(w, "mousedown");
    const mouseUp = mouseLastSnapShot(w, "mouseup");

    const lastDrag = w.wrap(() => {
        // console.log(mouseUp.ts(), mouseDown.ts());
        if (mouseUp.ts() >= mouseDown.ts()) {
            return Math.sqrt(Math.pow(mouseUp.x() - mouseDown.x(), 2) + Math.pow(mouseUp.y() - mouseDown.y(), 2));
        } else {
            return 0;
        }
    });

    const cellProcessor = w.wrap(() => {
        //
        return "[" + cellInput() + " " + cellInput2() + " " +
            timer() +
            " " + lastDrag() + "]";
    });

    const cnv = (<HTMLCanvasElement>document.getElementById("cnv"));
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight - 100;
    cnv.style.position = "fixed";
    cnv.style.left = 0 + "px";
    cnv.style.top = 100 + "px";

    w.wrap(() => {
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

    w.wrap(() => {
        document.getElementById("res").innerText = cellProcessor();
        return null;
    });

    w.go();
});