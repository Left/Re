/// <reference path="htmlTools.ts"/>

document.addEventListener("DOMContentLoaded", () => {
    const w = new Re.World();

    const cellInput = HtmlTools.dataFromInput(w, "inp", "input", el => (<HTMLInputElement>el).value);
    const cellInput2 = HtmlTools.dataFromInput(w, "check", "change", el => (<HTMLInputElement>el).checked);
    const cellInput3 = HtmlTools.dataFromInput(w, "inp3", "input", el => (<HTMLInputElement>el).value);
    const selInput = HtmlTools.dataFromInput(w, "sel", "change", el => {
        const sel = (<HTMLSelectElement>el);
        return sel.options[sel.selectedIndex].value;
    });

    document.getElementById("defs").addEventListener("click",
        e => {
            (<HTMLSelectElement>document.getElementById("sel")).selectedIndex = 0;
            selInput();
        });

    //const timer = w.wrap(() => {
    //    return (new Date()).toString();
    //});
    //setInterval(timer, 25);

    const cellProcessor = w.wrap(() => {
        //
        return "[" + cellInput() + " " +
            (cellInput2() ? "" + cellInput3() : "<>") + " " +
            selInput() +
            // timer() +
            "]";
    });

    w.wrap(() => {
        (<HTMLInputElement>document.getElementById("inp3")).disabled = !cellInput2();
    });

    w.wrap(() => {
        document.getElementById("res").innerText = cellProcessor();
        return null;
    });

    w.go();
});