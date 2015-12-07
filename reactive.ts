
module Re {
    type Value = string|number;

    export interface Cell<T> {
        (): T;
    }

    export class Processors {
        private nextId: number = 0;
        // private deps: { [id: string]: string[] };
        private nowCallling: Cell<any>;
        private all:Cell<any>[] = [];
        private init: boolean;

        wrap<T>(f: Cell<T>): Cell<T> {
            f["id"] = ++(this.nextId);
            const fCont = f.toString();
            f["toString"] = function() { return f["id"] };

            console.log("Wrapped", fCont, "as", f["id"]);
            f["deps"] = [];

            const wrapped: Cell<T> = (): T => {
                const wasCalling = this.nowCallling;

                if (wasCalling) {
                    f["deps"].push(wasCalling);
                }

                this.nowCallling = f;
                console.log(wasCalling, "calls", this.nowCallling);

                const res:T = f();

                this.nowCallling = wasCalling;

                if (f["val"] !== res) {
                    console.log(f, "has a new val", res);
                    f["val"] = res;
                    if (!this.init) {
                        setTimeout(() => {
                            for (const wr of f['deps']) {
                                wr['wrapper']();
                            }
                        }, 1);
                    }
                }

                return res;
            };
            f["wrapper"] = wrapped;
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