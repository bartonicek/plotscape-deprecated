import { Scale } from "./Scale.js";

export class ScaleContinuous extends Scale {
  includeZero: boolean;
  data: number[] = [];

  constructor(
    length: number,
    direction = 1,
    includeZero = false,
    expand = 0.1
  ) {
    super(length, direction, expand);
    this.includeZero = includeZero;
  }

  registerData = (data: number[]) => {
    this.data = this.includeZero
      ? [0, Math.max(...data)]
      : [Math.min(...data), Math.max(...data)];
    return this;
  };

  get dataMin() {
    const { data, expand } = this;
    return this.includeZero
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
