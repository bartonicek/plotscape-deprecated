import { Scale } from "./Scale.js";

export class ScaleContinuous extends Scale {
  zero: boolean;
  data: number[] = [];

  constructor(length: number, direction = 1, zero = false, expand = 0.1) {
    super(length, direction, expand);
    this.zero = zero;
  }

  registerData = (data: number[]) => {
    this.data = this.zero ? [].concat([0], data) : data;
    return this;
  };

  get dataMin() {
    const { data, expand } = this;
    return this.zero
      ? 0
      : Math.min(...data) - expand * (Math.max(...data) - Math.min(...data));
  }

  get dataMax() {
    const { data, expand } = this;
    return Math.max(...data) + expand * (Math.max(...data) - Math.min(...data));
  }

  get range() {
    return this.dataMax - this.dataMin;
  }

  inRange = (x: number) => {
    return x >= this.dataMin && x <= this.dataMax;
  };

  pctToData = (pct: number | number[]) => {
    const { dataMin, range } = this;
    return typeof pct === "number"
      ? dataMin + pct * range
      : pct.map((e) => dataMin + e * range);
  };

  dataToPct = (data: number | number[]) => {
    const { dataMin, range } = this;
    return typeof data === "number"
      ? (data - dataMin) / range
      : data.map((e) => (e - dataMin) / range);
  };

  dataToUnits = (data: number | number[]) => {
    const { dataMin, length, offset, direction, range } = this;

    return typeof data === "number"
      ? offset + (direction * length * (data - dataMin)) / range
      : data.map((e) => offset + direction * length * ((e - dataMin) / range));
  };

  unitsToData = (units: number | number[]) => {
    const { dataMin, length, offset, direction, range } = this;
    return typeof units === "number"
      ? dataMin + (direction * range * (units - offset)) / length
      : units.map((e) => dataMin + direction * range * ((e - offset) / length));
  };
}
