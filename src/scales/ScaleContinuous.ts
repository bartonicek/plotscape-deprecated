import * as dtstr from "../datastructures.js";

export class ScaleContinuous {
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

  unitsToPct = (units: null | number | number[] | dtstr.SparseFloat32Array) => {
    if (units === null) return null;
    if (dtstr.isArray(units)) {
      const isSparse = units instanceof dtstr.SparseFloat32Array;
      let [i, res] = [units.length, new dtstr.SparseFloat32Array(units)];

      while (i--) {
        if (isSparse && units.missing.has(i)) continue;
        if (units[i] === null) {
          res.missing.add(i);
          continue;
        }
        res[i] = (units[i] - this.min) / this.range;
      }
      return res;
    }
    return (units - this.min) / this.range;
  };

  pctToUnits = (pct: null | number | number[] | dtstr.SparseFloat32Array) => {
    if (pct === null) return null;
    if (dtstr.isArray(pct)) {
      const isSparse = pct instanceof dtstr.SparseFloat32Array;
      let [i, res] = [pct.length, new dtstr.SparseFloat32Array(pct)];

      while (i--) {
        if (isSparse && pct.missing.has(i)) continue;
        if (pct[i] === null) {
          res.missing.add(i);
          continue;
        }
        res[i] = this.min + pct[i] * this.range;
      }
      return res;
    }
    return this.min + pct * this.range;
  };
}
