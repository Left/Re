/// <reference path="reactive.ts"/>

module HtmlTools {
    export function dataFromInput<T>(w: Re.World, id: string, evName: string, getter: (el: HTMLElement) => T): Re.Cell<T> {
        const ret = w.wrap(() => {
            return getter((<HTMLElement>document.getElementById(id)));
        });

        document.getElementById(id).addEventListener(evName,
            e => {
                ret();
            });

        return ret;
    }

}