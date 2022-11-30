import * as sprs from "../sparsearrays.js";

export class LengthScaleContinuous {
  readonly continuous: boolean;
  readonly zero: boolean;
  lengthMin: number;
  lengthMax: number;
  dataMin: number;
  dataMax: number;

  constructor(zero = false) {
    this.continuous = true;
    this.zero = zero;
    this.lengthMin = 0;
    this.lengthMax = 1;
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
    this.lengthMin = min;
    this.lengthMax = max;
    return this;
  };

  registerData = (data: number[]) => {
    this.dataMin = this.zero ? 0 : Math.min(...data);
    this.dataMax = Math.max(...data);
    return this;
  };

  dataToPlot = (data: number | number[] | sprs.SparseArray) => {
    const { dataMin, dataMax } = this;
    if (sprs.isArrayLike(data)) {
      let [i, res] = [data.length, new sprs.SparseFloat32Array(data)];
      while (i--) {
        if (res.empty[i]) continue;
        res[i] = data[i] / dataMax;
      }
      return res;
    }
    return data / dataMax;
  };
}
