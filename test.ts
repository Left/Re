/// <reference path="reactive.ts"/>

document.addEventListener("DOMContentLoaded", () => {
    const w = new Re.Processors();

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
    const cellInput2 = dataFromInput("inp2");;

    const timer: () => number = w.wrap(() => {
        return new Date().getTime();
    });
    setInterval(timer, 25);

    const cellProcessor = w.wrap(() => {
        return "[" + cellInput() + " " + cellInput2() + " " + timer() + "]";
    });

    w.wrap(() => {
        document.getElementById("res").innerText = cellProcessor();
        return null;
    });

    w.go();
});