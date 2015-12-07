/// <reference path="reactive.ts"/>

document.addEventListener("DOMContentLoaded", () => {
    const w = new Re.Processors();

    const cellInput = w.wrap(() => {
        return (<HTMLInputElement>document.getElementById("inp")).value;
    });

    document.getElementById("inp").addEventListener('input', (e) => {
        w.rerequest(cellInput);
    });

    const cellProcessor = w.wrap(() => {
        return "[" + cellInput() + "]";
    });


    w.wrap(() => {
        document.getElementById("res").innerText = cellProcessor();
        return null;
    });

    w.go();
});