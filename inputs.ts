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
            console.log(firstName());
            console.log(hasFirstName());
            console.log(secondName());
            console.log(footSize());
        });

    // This should calc a result text
    const resultText = w.wrap(() => {
        var res = "[" + firstName() + " " +
            (hasFirstName() ? secondName() : "") + " " +
            footSize() +
            "]";
        return res;
    });

    w.wrap(() => {
        console.log("[" + firstName() + " " +
            secondName() + "]");
        return null;
    });

    w.wrap(() => (<HTMLInputElement>document.getElementById("secondName")).disabled = !hasFirstName() );

    w.wrap(() => document.getElementById("res").textContent = resultText() );

    const childrenCount = HtmlTools.stringFromInput(w, document.getElementById("childrenCount"));

    const children = w.makeCellArray();

    w.wrap(() => {
        const shouldBe = +(childrenCount());
        const parent = document.getElementById("children");

        // for (var i=0; i<Math.min(parent.children.length, shouldBe); ++i) {
        // }

        for (var i = parent.children.length; i < shouldBe; ++i) {
            const toAdd = document.createElement("div");
            const el = document.createElement("input");

            toAdd.appendChild(el);
            // toAdd.appendChild(document.createElement("br"));

            parent.appendChild(toAdd);

            children()[i] = HtmlTools.stringFromInput(w, el);
        }

        for (var i = parent.children.length; i > shouldBe; --i) {
            parent.removeChild(parent.children.item(i-1));
        }

        if (shouldBe !== children().length) {
            children().length = shouldBe;
            children();
        }
    });

    document.getElementById("addChild").addEventListener("click", e => {
        const el = (<HTMLInputElement>document.getElementById("childrenCount"));
        el.value = "" + (+el.value + 1);
        childrenCount();
    });

    w.wrap(() => {
        document.getElementById("resChildren").textContent =
            "[" + childrenCount() + "]" +
            children().map((child) => child() ).join(" ");
    });

    w.go();
});