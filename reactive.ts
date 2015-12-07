
module Re {
    type Value = string|number;

    export interface Cell<T> {
        (): T;
    }

    export class Processors {
        private nextId: number = 0;

        private nowCalling: Cell<any>;
        private all:Cell<any>[] = [];
        private init: boolean;

        wrap<T>(f: Cell<T>): Cell<T> {
            f["id"] = ++(this.nextId);
            f["deps"] = {};

            const fCont = f.toString();
            f.toString = () => "id " + f["id"];

            // console.log("Wrapped", fCont, "as", f["id"]);

            const wrapped: Cell<T> = (): T => {
                // console.log("{", f.toString());

                const wasCalling = this.nowCalling;

                if (wasCalling) {
                    f["deps"][wasCalling["id"]] = wasCalling;
                    //  console.log(wasCalling.toString(), "calls", f.toString());
                }

                this.nowCalling = f;

                // Real call here
                // console.log("Calling", f.toString(), "( callers:", Object.keys(f['deps']).join(", "), ")");
                const res:T = f();

                this.nowCalling = wasCalling;

                if (f["val"] !== res) {
                    // console.log(f.toString(), "has a new val", res);
                    f["val"] = res;

                    if (!this.init) {
                        setTimeout(() => {
                            if (wasCalling) {
                                wasCalling['wrapper']();
                            }
                            // console.log("Recall", Object.keys(f['deps']).join(", "));

                            for (const wr in f['deps']) {
                                var toCall = f['deps'][wr];
                                // console.log("Need to recall>", wr, toCall.toString(), toCall["wrapper"].toString());
                                toCall["wrapper"]();
                                // console.log("Called!", toCall.toString());
                                // wr['wrapper']();
                            }

                        }, 100);
                    }
                }

                // console.log("}", f.toString());

                return res;
            };
            f["wrapper"] = wrapped;
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