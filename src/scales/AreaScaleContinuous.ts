import * as sprs from "../sparsearrays.js";

export class AreaScaleContinuous {
  readonly continuous: boolean;
  readonly zero: boolean;
  areaMin: number;
  areaMax: number;
  dataMin: number;
  dataMax: number;

  constructor(zero = false) {
    this.continuous = true;
    this.zero = zero;
    this.areaMin = 0;
    this.areaMax = 1;
    this.dataMax = 0;
    this.dataMin = 0;
  }

  get dataRange() {
    return this.dataMax - this.dataMin;
  }

  get dataRepresentation() {
    return [this.dataMin, this.dataMax];
  }

  setPlotLimits = (min: number, max: number) => {
    this.areaMin = min;
    this.areaMax = max;
    return this;
  };

  registerData = (data: number[]) => {
    const sorted = data.sort((a, b) => a - b);
    this.dataMin = this.zero ? 0 : sorted[0];
    this.dataMax = sorted[sorted.length - 1];
    return this;
  };

  dataToPlot = (data: number | number[] | sprs.SparseArray) => {
    const { dataMin, dataMax } = this;
    if (sprs.isArrayLike(data)) {
      let [i, res] = [data.length, new sprs.SparseFloat32Array(data)];
      while (i--) {
        if (res.empty[i]) continue;
        res[i] = Math.sqrt(data[i] / dataMax);
      }
      return res;
    }
    return Math.sqrt(data / dataMax);
  };
}
