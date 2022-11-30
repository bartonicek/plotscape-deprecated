const isArrayLike = (arg) => {
    return Array.isArray(arg) || ArrayBuffer.isView(arg);
};
class SparseArray extends Array {
    constructor(arg) {
        if (isArrayLike(arg)) {
            super(arg.length);
            let i = arg.length;
            while (i--)
                this[i] = arg[i];
            this.empty = new Uint8Array(arg.length);
            return this;
        }
        super(arg);
        this.empty = new Uint8Array(arg);
    }
}
class SparseFloat32Array extends Float32Array {
    constructor(arg) {
        if (isArrayLike(arg)) {
            super(arg);
            this.empty = new Uint8Array(arg.length);
            if ("empty" in arg)
                this.empty.set(arg.empty);
            return this;
        }
        super(arg);
        this.empty = new Uint8Array(arg);
    }
}
class SparseUint16Array extends Uint16Array {
    constructor(arg) {
        if (isArrayLike(arg)) {
            super(arg);
            this.empty = new Uint8Array(arg.length);
            if ("empty" in arg)
                this.empty.set(arg.empty);
            return this;
        }
        super(arg);
        this.empty = new Uint8Array(arg);
    }
}
export { isArrayLike, SparseArray, SparseFloat32Array, SparseUint16Array, };
