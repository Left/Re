
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

            const fCont = f.toString();
            f.toString = () => "id " + f["id"];

            console.log("Wrapped", fCont, "as", f["id"]);

            f["deps"] = [];

            const wrapped: Cell<T> = (): T => {
                const wasCalling = this.nowCalling;

                if (wasCalling) {
                    f["deps"].push(wasCalling);
                    console.log(wasCalling, "calls", f);
                }

                this.nowCalling = f;

                if (wasCalling === this.nowCalling) {
                    console.trace();
                    return;
                }

                const res:T = f();

                this.nowCalling = wasCalling;

                if (f["val"] !== res) {
                    console.log(f, "has a new val", res);
                    f["val"] = res;
                    if (!this.init) {
                        setTimeout(() => {
                            for (const wr of f['deps']) {
                                console.log("Need to recall>", wr['wrapper']);
                                // wr['wrapper']();
                            }
                        }, 1000);
                    }
                }

                return res;
            };
            f["wrapper"] = wrapped;
            wrapped.toString = () => "Wrapped " + f.toString();
            this.all.push(wrapped);

            return <Cell<T>>wrapped;
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