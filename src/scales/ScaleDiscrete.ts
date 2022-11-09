import { VectorGeneric } from "../datastructures.js";
import { Plot } from "../main.js";
import { Scale } from "./Scale.js";
import * as funs from "./../functions.js";

export class ScaleDiscrete extends Scale {
  discrete: boolean;
  values: VectorGeneric;
  positionsOriginal: number[];

  constructor(
    length: number,
    plot: Plot,
    direction = 1,
    expand = { lower: 0, upper: 0 }
  ) {
    super(length, plot, direction, expand);
    this.discrete = true;
    this.values = [];
  }

  registerData = (data: VectorGeneric) => {
    this.data = data;
    const arr = Array.from(new Set([...data]));

    this.values =
      typeof arr[0] === "number"
        ? (arr as number[]).sort((a, b) => a - b)
        : arr.sort();

    this.positionsOriginal = Array.from(
      Array(this.values.length),
      (e, i) => (i + 1) / (this.values.length + 1)
    );
    return this;
  };

  get range() {
    return 1 + this.expand.lower + this.expand.upper;
  }

  get positions() {
    const { lower, upper } = this.expand;
    const shift = upper - lower + (0.5 - 0.5 / this.range);
    return this.positionsOriginal.map((e) => e / this.range + shift);
  }

  dataToUnits = (x: any | any[]) => {
    if (x == null) return null;

    const { values, length, direction, positions, offset, expand } = this;
    const strX = funs.stringify(x);
    const strValues = funs.stringify(values);
    const len = length;

    if (typeof strX === "string" && strValues.indexOf(strX) !== -1) {
      return offset + direction * len * positions[strValues.indexOf(strX)];
    }

    return strX.map((e: any) => {
      if (strValues.indexOf(e) !== -1) {
        return offset + direction * len * positions[strValues.indexOf(e)];
      }
    });
  };
}
