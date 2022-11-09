import { Plot } from "../main.js";
import { Scale } from "./Scale.js";
import * as funs from "./../functions.js";

export class ScaleContinuous extends Scale {
  continuous: boolean;
  includeZero: boolean;
  data: number[] = [];
  dataMinOriginal: number;
  dataMaxOriginal: number;

  constructor(
    length: number,
    plot: Plot,
    direction = 1,
    includeZero = false,
    expand = { lower: 0.1, upper: 0.1 }
  ) {
    super(length, plot, direction, expand);
    this.continuous = true;
    this.includeZero = includeZero;
  }

  registerData = (data: number[]) => {
    this.data = this.includeZero ? [0, ...data] : data;
    this.dataMinOriginal = funs.min(data);
    this.dataMaxOriginal = funs.max(data);
    return this;
  };

  get rangeOriginal() {
    return this.dataMaxOriginal - this.dataMinOriginal;
  }

  get dataMin() {
    const { includeZero, dataMinOriginal, rangeOriginal, expand } = this;
    return includeZero ? 0 : dataMinOriginal - expand.lower * rangeOriginal;
  }

  get dataMax() {
    const { dataMaxOriginal, rangeOriginal, expand } = this;
    return dataMaxOriginal + expand.upper * rangeOriginal;
  }

  get range() {
    return this.dataMax - this.dataMin;
  }

  inRange = (x: number) => {
    return x >= this.dataMin && x <= this.dataMax;
  };

  pctToData = (pct: number | number[]) => {
    if (pct === null) return null;

    const { dataMin, range } = this;
    if (typeof pct === "number") return dataMin + pct * range;

    return pct.map((e) => {
      if (e === null) return null;
      return dataMin + e * range;
    });
  };

  dataToPct = (data: number | number[]) => {
    if (data === null) return null;

    const { dataMin, range } = this;
    if (typeof data === "number") return (data - dataMin) / range;

    return data.map((e) => {
      if (e === null) return null;
      return (e - dataMin) / range;
    });
  };

  dataToUnits = (data: number | number[]) => {
    if (data === null) return null;

    const { dataMin, length, offset, direction, range } = this;
    if (typeof data === "number")
      return offset + (direction * length * (data - dataMin)) / range;

    return data.map((e) => {
      if (e === null) return null;
      return offset + direction * length * ((e - dataMin) / range);
    });
  };

  unitsToData = (units: number | number[]) => {
    if (units === null) return null;

    const { dataMin, length, offset, direction, range } = this;
    if (typeof units === "number")
      return dataMin + (direction * range * (units - offset)) / length;

    return units.map((e) => {
      if (e === null) return null;
      return dataMin + direction * range * ((e - offset) / length);
    });
  };
}
