/// <reference path="htmlTools.ts"/>

document.addEventListener("DOMContentLoaded", () => {
    const w = new Re.World();

    const cellInput = HtmlTools.stringFromInput(w, "inp");
    const cellInput2 = HtmlTools.booleanFromCheckbox(w, "check");
    const cellInput3 = HtmlTools.stringFromInput(w, "inp3");
    const selInput = HtmlTools.valFromSelect(w, "sel");

    document.getElementById("defs").addEventListener("click",
        () => {
            (<HTMLSelectElement>document.getElementById("sel")).selectedIndex = 0;
            selInput();
        });

    //const timer = w.wrap(() => {
    //    return (new Date()).toString();
    //});
    //setInterval(timer, 25);

    const cellProcessor = w.wrap(() => {
        var res = "[" + cellInput() + " " +
            (cellInput2() ? cellInput3() : "") + " " +
            selInput() +
            "]";
        return res;
    });

    w.wrap(() => {
        (<HTMLInputElement>document.getElementById("inp3")).disabled = !cellInput2();
    });

    w.wrap(() => {
        document.getElementById("res").textContent = cellProcessor();
        return null;
    });

    w.go();
});