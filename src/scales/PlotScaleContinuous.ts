import * as sprs from "../sparsearrays.js";

export class PlotScaleContinuous {
  readonly continuous: boolean;
  readonly zero: boolean;
  plotMin: number;
  plotMax: number;
  private _dataMin: number;
  private _dataMax: number;
  expandMin: number;
  expandMax: number;

  constructor(zero = false) {
    this.continuous = true;
    this.zero = zero;
    this.plotMin = 0;
    this.plotMax = 0;
    this._dataMax = 0;
    this._dataMin = 0;
    this.expandMin = 0;
    this.expandMax = 0;
  }

  get plotRange() {
    return this.plotMax - this.plotMin;
  }

  get dataMin() {
    return this._dataMin - this.expandMin * (this._dataMax - this._dataMin);
  }

  get dataMax() {
    return this._dataMax + this.expandMax * (this._dataMax - this._dataMin);
  }

  get dataRange() {
    return this.dataMax - this.dataMin;
  }

  get dataRepresentation() {
    return [this.dataMin, this.dataMax];
  }

  setPlotLimits = (min: number, max: number) => {
    this.plotMin = min;
    this.plotMax = max;
    return this;
  };

  registerData = (data: number[]) => {
    const sorted = data.sort((a, b) => a - b);
    this._dataMin = this.zero ? 0 : sorted[0];
    this._dataMax = sorted[sorted.length - 1];
    return this;
  };

  expand = (min: number, max: number) => {
    this.expandMin += min;
    this.expandMax += max;
    return this;
  };

  pctToPlot = (pct: number | number[]) => {
    const { plotMin, plotRange } = this;
    if (Array.isArray(pct)) {
      let [i, res] = [pct.length, Array(pct.length)];
      while (i--) res[i] = plotMin + pct[i] * plotRange;
      return res;
    }
    return plotMin + pct * plotRange;
  };

  dataToPlot = (data: number | number[] | sprs.SparseArray) => {
    const { dataMin, dataRange, plotMin, plotRange } = this;
    if (sprs.isArrayLike(data)) {
      let [i, res] = [data.length, new sprs.SparseUint16Array(data)];
      while (i--) {
        if (res.empty[i]) continue;
        res[i] = plotMin + ((data[i] - dataMin) / dataRange) * plotRange;
      }
      return res;
    }
    return plotMin + ((data - dataMin) / dataRange) * plotRange;
  };
}
