import { VectorGeneric } from "../datastructures.js";

export class Scale {
  data: VectorGeneric;
  lengthOriginal: number;
  offsetOriginal: number;
  span: number;
  direction: number;
  expand: number;

  constructor(length: number, direction = 1, expand = 0.1) {
    this.lengthOriginal = length;
    this.offsetOriginal = this.direction === -1 ? length : 0;
    this.span = 1;
    this.direction = direction;
    this.expand = expand;
  }

  get length() {
    return this.lengthOriginal * this.span;
  }

  get offset() {
    return this.offsetOriginal;
  }

  setLength = (length: number) => {
    this.lengthOriginal = length;
    this.offsetOriginal = this.direction === -1 ? length : 0;
  };

  registerData = (data: VectorGeneric) => {
    this.data = data;
    return this;
  };

  pctToUnits = (pct: number | number[]) => {
    const { length, offset, direction } = this;
    return typeof pct === "number"
      ? offset + direction * length * pct
      : pct.map((e) => offset + direction * length * e);
  };

  unitsToPct = (units: number | number[]) => {
    const { length } = this;
    return typeof units === "number"
      ? units / length
      : units.map((e) => e / length);
  };

  dataToPlot = (data: any | any[]) => {};
}
