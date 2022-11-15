type TypedArrayType =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

const isArrayLike = (
  arg: any | any[] | TypedArrayType | SparseArray
): arg is any[] | TypedArrayType | SparseArray => {
  return Array.isArray(arg) || ArrayBuffer.isView(arg);
};

type SparseArrayType = SparseArray | SparseFloat32Array | SparseUint16Array;

class SparseArray extends Array {
  empty: Uint8Array;

  constructor(arg: number | any[] | TypedArrayType | SparseArray) {
    if (isArrayLike(arg)) {
      super(arg.length);
      let i = arg.length;
      while (i--) this[i] = arg[i];
      this.empty = new Uint8Array(arg.length);
      return this;
    }
    super(arg);
    this.empty = new Uint8Array(arg);
  }
}

class SparseFloat32Array extends Float32Array {
  empty: Uint8Array;

  constructor(arg: number | number[] | TypedArrayType | SparseFloat32Array) {
    if (isArrayLike(arg)) {
      super(arg);
      this.empty = new Uint8Array(arg.length);
      if ("empty" in arg) this.empty.set(arg.empty);
      return this;
    }
    super(arg);
    this.empty = new Uint8Array(arg);
  }
}

class SparseUint16Array extends Uint16Array {
  empty: Uint8Array;

  constructor(arg: number | any[] | TypedArrayType | SparseArrayType) {
    if (isArrayLike(arg)) {
      super(arg);
      this.empty = new Uint8Array(arg.length);
      if ("empty" in arg) this.empty.set(arg.empty);
      return this;
    }
    super(arg);
    this.empty = new Uint8Array(arg);
  }
}

export {
  isArrayLike,
  SparseArrayType,
  SparseArray,
  SparseFloat32Array,
  SparseUint16Array,
};
