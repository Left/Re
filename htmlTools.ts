/// <reference path="reactive.ts"/>

module HtmlTools {
    export function dataFromInput<T>(w: Re.World, el: HTMLElement, evName: string, getter: (el: HTMLElement) => T): Re.CellWrapped<T> {
        const ret = w.wrap(() => {
            return getter(el);
        });

        el.addEventListener(evName, () => {
            ret();
        });

        return ret;
    }

    export function stringFromInput(w: Re.World, el: HTMLElement): Re.CellWrapped<string> {
        return dataFromInput(w, el, "input", el => (<HTMLInputElement>el).value);
    }

    export function booleanFromCheckbox(w: Re.World, el: HTMLElement): Re.CellWrapped<boolean> {
        return dataFromInput(w, el, "change", el => (<HTMLInputElement>el).checked);
    }

    export function valFromSelect(w: Re.World, el: HTMLElement): Re.CellWrapped<string> {
        return dataFromInput(w, el, "change", el => {
            const sel = (<HTMLSelectElement>el);
            return sel.options[sel.selectedIndex].value;
        });
    }
}