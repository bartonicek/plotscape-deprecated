import { VectorGeneric } from "../datastructures.js";
import { Plot } from "../main.js";

export abstract class Scale {
  data: VectorGeneric;
  plot: Plot;
  lengthOriginal: number;
  offsetOriginal: number;
  direction: number;
  expand: number;

  constructor(length: number, plot: Plot, direction = 1, expand = 0.1) {
    this.plot = plot;
    this.lengthOriginal = length;
    this.offsetOriginal = this.direction === -1 ? length : 0;
    this.direction = direction;
    this.expand = expand;
  }

  get length() {
    return this.lengthOriginal;
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
