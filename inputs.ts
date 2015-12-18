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

    class MyArray<T extends Re.Value> extends Array<Re.Cell<T>> implements Re.ObjectValue {
        isEqual(o: Re.ObjectValue): boolean {
            return o && this.length === (<MyArray<T>>o).length;
        }

        copy(): Re.ObjectValue {
            const ret = new MyArray();
            ret.length = this.length;
            this.forEach((e, i) => { ret[i] = this[i]; });

            return ret;
        }
    }

    const arr2 = new MyArray<string>();

    const elements = w.wrap(() => {
        // console.log("ELEMENTS");
        return arr2;
    });

    w.wrap(() => {
        const shouldBe = +(childrenCount());
        const parent = document.getElementById("children");

        // for (var i=0; i<Math.min(parent.children.length, shouldBe); ++i) {
        // }

        for (var i = parent.children.length; i < shouldBe; ++i) {
            const el = document.createElement("input");
            el.setAttribute("data-index", "" + i);

            parent.appendChild(el);

            elements()[i] = HtmlTools.stringFromInput(w, el);
        }

        for (var i = parent.children.length; i > shouldBe; --i) {
            (elements()[i] || (() => {}))();
            parent.removeChild(parent.children.item(i-1));
        }

        if (shouldBe !== elements().length) {
            elements().length = shouldBe;
            elements();
        }
    });

    w.wrap(() => {
        document.getElementById("resChildren").textContent = elements().map((child) => child() ).join(" ");
    });

    w.go();
});