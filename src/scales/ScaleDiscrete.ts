import * as dtstr from "../datastructures.js";
import * as funs from "../functions.js";

export class ScaleDiscrete {
  values: any[];
  positions: number[];
  positionValueMap: Map<typeof this.values[number], number>;

  setValues = (values: any[], sorted = false) => {
    this.values = sorted ? funs.unique(values) : funs.sort(funs.unique(values));
    const n = this.values.length;
    this.positions = [...Array(n).keys()].map((i) => (i + 1) / (n + 1));
    this.positionValueMap = new Map();
    this.values.forEach((e, i) =>
      this.positionValueMap.set(e, this.positions[i])
    );
    return this;
  };

  unitsToPct = (units: any | any[]) => {
    if (units === null) return null;
    if (dtstr.isArray(units)) {
      let [i, res] = [units.length, new dtstr.SparseFloat32Array(units.length)];
      while (i--) {
        if (units[i] === null) {
          res.missing.add(i);
          continue;
        }
        res[i] = this.positionValueMap.get(units[i]);
      }
      return res;
    }
    return this.positionValueMap.get(units) as number;
  };
}
