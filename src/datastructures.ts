import * as hndl from "handlers/handlers.js";

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;

const isArray = <Type>(
  x: Type | Type[] | TypedArray
): x is Array<Type> | TypedArray => {
  return Array.isArray(x) || ArrayBuffer.isView(x);
};

class SparseFloat32Array extends Float32Array {
  missing: Set<number>;
  constructor(arg: number | VectorGeneric | SparseFloat32Array) {
    if (arg instanceof SparseFloat32Array) {
      super(arg.length);
      this.missing = arg.missing;
      return;
    }
    const n = typeof arg === "number" ? arg : arg.length;
    super(n);
    this.missing = new Set();
  }
}

type MethodsOf<Type> = Pick<
  Type,
  {
    [key in keyof Type]: Type[key] extends () => void ? key : never;
  }[keyof Type]
>;

// Generic vector type has to be dirty otherwise methods like .map()
// and .filter() don't work
type VectorGeneric = (number | string | boolean)[];

class DataFrame {
  [key: string]: VectorGeneric;
  constructor(data: { [key: string]: VectorGeneric }) {
    Object.keys(data).forEach((e) => (this[e] = data[e]));
    this._indicator = Array(
      (this[Object.keys(this)[0]] as VectorGeneric).length
    ).fill(1);
  }
}

type ValidMappings = "x" | "y" | "size" | "fillHeight" | "_indicator";
class Mapping extends Map<ValidMappings, string> {
  constructor(...mappings: [ValidMappings, string][]) {
    super([...mappings]);
    if (!this.has("y")) this.set("y", "_indicator");
  }
}

type Point = [number, number];
type Rect2Points = [[number, number], [number, number]];

const baseMembershipArray = [1, 2, 3, 4] as const;
const transientMembershipArray = [129, 130, 131, 132] as const;
const validMembershipArray = [
  ...baseMembershipArray,
  ...transientMembershipArray,
  128,
] as const;
const [, ...highlightMembershipArray] = validMembershipArray;
type ValidMemberships = typeof validMembershipArray[number];

const plotTypeArray = [
  "scatter",
  "bubble",
  "bar",
  "histo",
  "square",
  "squareheat",
] as const;
type PlotTypes = typeof plotTypeArray[number];

type PlotConfig = {
  id: string;
  element: HTMLDivElement;
  data: DataFrame;
  mapping: Mapping;
  globals: Globals;
};

type Globals = {
  marker: hndl.MarkerHandler;
  keypress: hndl.KeypressHandler;
  state: hndl.StateHandler;
};

export {
  isArray,
  SparseFloat32Array,
  MethodsOf,
  DataFrame,
  VectorGeneric,
  ValidMappings,
  Mapping,
  baseMembershipArray,
  validMembershipArray,
  highlightMembershipArray,
  ValidMemberships,
  Point,
  Rect2Points,
  plotTypeArray,
  PlotTypes,
  PlotConfig,
  Globals,
};
