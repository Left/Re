/// <reference path="htmlTools.ts"/>

document.addEventListener("DOMContentLoaded", () => {
    const w = new Re.World();

    const firstName = HtmlTools.stringFromInput(w, document.getElementById("firstName"));
    const hasFirstName = HtmlTools.booleanFromCheckbox(w, document.getElementById("hasSecondName"));
    const secondName = HtmlTools.stringFromInput(w, document.getElementById("secondName"));
    const footSize = HtmlTools.valFromSelect(w, document.getElementById("footSz"));

    document.getElementById("defaults").addEventListener("click",
        () => {
            (<HTMLSelectElement>document.getElementById("footSz")).selectedIndex = 0;
            footSize();
        });

    document.getElementById("send").addEventListener("click",
        () => {
            console.log(firstName.value());
            console.log(hasFirstName.value());
            console.log(secondName.value());
            console.log(footSize.value());
        });

    // This should calc a result text
    const resultText = w.wrap(() => {
        var res = "[" + firstName() + " " +
            (hasFirstName() ? secondName() : "") + " " +
            footSize() +
            "]";
        return res;
    });

    w.wrap(() => (<HTMLInputElement>document.getElementById("secondName")).disabled = !hasFirstName() );

    w.wrap(() => document.getElementById("res").textContent = resultText());

    w.go();
});