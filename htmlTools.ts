/// <reference path="reactive.ts"/>

module HtmlTools {
    export function dataFromInput<T>(w: Re.World, id: string, evName: string, getter: (el: HTMLElement) => T): Re.Cell<T> {
        const ret = w.wrap(() => {
            return getter((<HTMLElement>document.getElementById(id)));
        });

        document.getElementById(id).addEventListener(evName,
            () => {
                ret();
            });

        return ret;
    }

    export function stringFromInput(w: Re.World, id: string): Re.Cell<string> {
        return dataFromInput(w, id, "input", el => (<HTMLInputElement>el).value);
    }

    export function booleanFromCheckbox(w: Re.World, id: string): Re.Cell<boolean> {
        return dataFromInput(w, id, "change", el => (<HTMLInputElement>el).checked);
    }

    export function valFromSelect(w: Re.World, id: string): Re.Cell<string> {
        return dataFromInput(w, id, "change", el => {
            const sel = (<HTMLSelectElement>el);
            return sel.options[sel.selectedIndex].value;
        });
    }
}