/// <reference path="../reactive.ts"/>

function addStr(str: string, color?: string): void {
    const d = document.createElement("div");
    d.innerText = str;
    if (color)
        d.style.color = color;
    document.getElementById("out").appendChild(d);
}

function addStackTrace(msg: string, str: string[]): void {
    addStr(msg, "red");

    for (const l of str) {
        addStr(l, "red");
    }
}

interface Error {
    stack: string;
}

function stackTraceFromError(err: Error, ignoreCalls?: number): string[] {
    return err.stack.split(/\r\n|\r|\n/gi).slice(ignoreCalls || 0);
}

function assert(b: boolean, str?: string) {
    if (!b) {
        var err = stackTraceFromError(new Error(), 2);

        addStackTrace("ASSERT FAILED: " + (str || "<no message>"), err);
    }
}

function OK(name? : string) {
    addStr("OK " + (name || ""), "#00B000");
}

const tests = [
    () => {
        const w = new Re.World();

        const arr: number[] = [1, 2];
        var res = 3;

        const first: Re.Cell<number> = w.wrap(() => {
            return arr[0];
        });

        const second: Re.Cell<number> = w.wrap(() => {
            return arr[1];
        });

        var calls = 0;

        w.wrap(() => {
            calls++;
            assert(first() + second() === res, "A");
        })

        w.wrap(() => {
            calls++;
            assert(first() + second() === res, "B");
        })

        w.go();

        assert(calls == 2);

        arr[0] = 3;
        res[0] = 5;
        first();

        assert(calls == 4);

        OK("Simple no param");
    },
    () => {
        const w = new Re.World();
        w.go();

        OK("Empty");
    }
];

document.addEventListener("DOMContentLoaded", () => {
    for (const t of tests) {
        try {
            t();
        } catch (e) {
            addStackTrace(e.toString(), e);
        }
    }
});