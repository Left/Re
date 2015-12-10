
module Re {
    type Value = string|number;

    export interface Cell<T> {
        (): T;
    }

    interface Cell2<T> extends Cell<T> {
        id: number;
        deps: { [id: number]: Cell2<T> };
        val: T;
        wrapper: Cell<T>;
    }

    export class World {
        private nextId: number = 0;

        private nowCalling: Cell2<any>;
        private all:Cell<any>[] = [];
        private init: boolean;

        wrap<T>(fPar: Cell<T>): Cell<T> {
            const f = <Cell2<T>> fPar;

            f.id = ++(this.nextId);
            f.deps = {};

            const fCont = f.toString();
            f.toString = () => "id (" + f.id + ")";

            // console.log("Wrapped", fCont, "as", f["id"]);

            const wrapped: Cell<T> = (): T => {
                // console.log("{", f.toString());

                const wasCalling = this.nowCalling;

                if (wasCalling) {
                    f.deps[wasCalling.id] = wasCalling;
                    //  console.log(wasCalling.toString(), "calls", f.toString());
                }

                this.nowCalling = f;

                // Real call is performed here
                // console.log("Calling", f.toString(), "( callers:", Object.keys(f['deps']).join(", "), ")");
                const res:T = f();

                this.nowCalling = wasCalling;

                if (f.val !== res) {
                    // console.log(f.toString(), f.val, "=>", res);
                    f.val = res;

                    if (!this.init) {
                        // console.log("Recall", Object.keys(f['deps']).join(", "));

                        var deps = f.deps; // Save dependencies
                        f.deps = {}; // Drop current dependencies. They will be re-filled during the next loop
                        for (const wr in deps) {
                            var toCall = deps[wr];
                            // console.log("Need to recall>", wr, toCall.toString());
                            toCall.wrapper();
                            // console.log("Called!", toCall.toString());
                            // wr['wrapper']();
                        }
                    }
                }

                // console.log("}", f.toString());

                return res;
            };
            f.wrapper = wrapped;
            wrapped.toString = () => "Wrapped " + f.toString();
            this.all.push(wrapped);

            return wrapped;
        }

        rerequest<T>(who: Cell<T>) {
            who();
        }

        go(): void {
            this.init = true;

            for (const wr of this.all.reverse()) {
                this.rerequest(wr);
            }

            this.init = false;
            // Let's run the whole world
        }
    };
}