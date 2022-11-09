import * as dtstr from "./../datastructures.js";

export class ScaleContinuous2 {
  min: number;
  max: number;

  setLimits = (min: number, max: number) => {
    this.min = min;
    this.max = max;
    return this;
  };

  get range() {
    return this.max - this.min;
  }

  unitsToPct = (units: number | number[] | Float32Array) => {
    if (units === null) return null;
    if (dtstr.isArray(units)) {
      let [i, res] = [units.length, new Float32Array(units.length)];
      while (i--) res[i] = (units[i] - this.min) / this.range;
      return res;
    }
    return (units - this.min) / this.range;
  };

  pctToUnits = (pct: null | number | number[] | Float32Array) => {
    if (pct === null) return null;
    if (dtstr.isArray(pct)) {
      let [i, res] = [pct.length, new Float32Array(pct.length)];
      while (i--) res[i] = this.min + pct[i] * this.range;
      return res;
    }
    return this.min + pct * this.range;
  };
}
