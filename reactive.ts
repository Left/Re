
module Re {
    export interface ObjectValue {
        isEqual(o: ObjectValue): boolean;
        copy(): ObjectValue;
    }

    export interface ObjectValueImpl<T extends ObjectValue> extends ObjectValue {
        isEqual(o: T): boolean;
        copy(): T;
    }

    export type Value = ObjectValue | string | number | boolean | void;

    export interface Cell<T extends Value> {
        (): T;
    }

    export interface CellWrapped<T extends Value> extends Cell<T> {
        (): T;
    }

    interface Cell2<T extends Value> extends Cell<T> {
        id: number;
        initialized: boolean;
        deps: { [id: number]: Cell2<T> };
        val: Value;
        wrapper: CellWrapped<T>;
    }

    export class World {
        private nextId: number = 0;

        private nowCalling: Cell2<any>;
        private all:Cell2<any>[] = [];

        wrap<T extends Value>(fPar: Cell<T>): CellWrapped<T> {
            const f = <Cell2<T>> fPar;

            f.id = ++(this.nextId);
            f.deps = {};
            f.initialized = false;

            const fCont = f.toString();
            f.toString = () => "id (" + f.id + ")";

            // console.log("Wrapped", fCont, "as", f["id"]);

            const wrapped = (): T => {
                // console.log("{", f.toString());

                const wasCalling = this.nowCalling;

                if (wasCalling) {
                    f.deps[wasCalling.id] = wasCalling;
                    // console.log(wasCalling.toString(), "calls", f.toString());
                }

                this.nowCalling = f;

                // Real call is performed here
                // console.log("Calling", f.toString(), "( callers:", Object.keys(f['deps']).join(", "), ")");
                const res:Value = f();
                f.initialized = true;

                this.nowCalling = wasCalling;

                if ((
                        (typeof res === "object" && res != null) ?
                            !((<ObjectValue>res).isEqual(<ObjectValue>(f.val))) :
                            f.val !== res)) {
                    // console.log(f.toString(), f.val, "!==", res);
                    // console.log("Recall", Object.keys(f['deps']).join(", "));

                    if (typeof res === "object" && res != null) {
                        f.val = (<ObjectValue>res).copy();
                        if (!(<ObjectValue>res).isEqual(<ObjectValue>(f.val))) {
                            console.trace();
                        }
                    } else {
                        f.val = res;
                    }
                    var deps = f.deps; // Save dependencies
                    f.deps = {}; // Drop current dependencies. They will be re-filled during the next loop
                    for (const wr in deps) {
                        var toCall = deps[wr];
                        // console.log("Need to recall>", wr, toCall.toString());
                        toCall.wrapper();
                        // console.log("Called!", toCall.toString());
                    }
                } else {
                    // console.log(f.toString(), f.val, "===", res);
                }

                // console.log("}", f.toString());

                return <T>res;
            };
            f.wrapper = wrapped;
            wrapped.toString = () => "Wrapped " + f.toString();

            wrapped["f"] = f;
            // wrapped["value"] = () => f.val;

            this.all.push(f);

            return <CellWrapped<T>>wrapped;
        }

        makeCellArray() {
            class CellArray<T extends Re.Value> extends Array<Re.Cell<T>> implements Re.ObjectValue {
                isEqual(o: Re.ObjectValue): boolean {
                    return o && this.length === (<CellArray<T>>o).length;
                }

                copy(): Re.ObjectValue {
                    const ret = new CellArray();
                    ret.length = this.length;
                    this.forEach((e, i) => { ret[i] = this[i]; });

                    return ret;
                }
            }

            const arr2 = new CellArray<string>();

            return this.wrap(() => {
                return arr2;
            });
        }

        go(): void {
            console.log("Initializing");
            // Let's run the whole world
            const callUninitialized = () => {
                for (var i = this.all.length - 1; i >= 0; --i) {
                    if (!this.all[i].initialized) {
                        this.all[i].wrapper();
                        callUninitialized();
                    }
                }
            }
            callUninitialized();
            console.log("Initializing done");
        }
    };
}