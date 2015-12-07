/// <reference path="reactive.ts"/>

document.addEventListener("DOMContentLoaded", () => {
    const world = new Re.Processors();

    const cellInput = world.wrap(() => {
        return (<HTMLInputElement>document.getElementById("inp")).value;
    });

    document.getElementById("inp").addEventListener('input', (e) => {
        world.rerequest(cellInput);
    });

    const cellProcessor = world.wrap(() => {
        return "[" + cellInput() + "]";
    });


    world.wrap(() => {
        document.getElementById("res").innerText = cellProcessor();
        return null;
    });

    world.go();
});