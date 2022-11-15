import * as funs from "../functions.js";
import * as sprs from "../sparsearrays.js";

export class PlotScaleDiscrete {
  readonly continuous: boolean;
  readonly zero: boolean;
  plotMin: number;
  plotMax: number;
  private _dataValues: any[];
  private _positions: number[];
  positionValueMap: Map<any, number>;
  expandMin: number;
  expandMax: number;

  constructor() {
    this.continuous = false;
    this.plotMin = 0;
    this.plotMax = 0;
    this.expandMin = 0;
    this.expandMax = 0;
  }

  get plotRange() {
    return this.plotMax - this.plotMin;
  }

  get dataRepresentation() {
    return this._dataValues;
  }

  get unitRange() {
    return 1 - this.expandMin - this.expandMax;
  }

  get breakWidth() {
    return Math.abs(
      (this.dataToPlot(this._dataValues[1]) as number) -
        (this.dataToPlot(this._dataValues[0]) as number)
    );
  }

  setPlotLimits = (min: number, max: number) => {
    this.plotMin = min;
    this.plotMax = max;
    return this;
  };

  registerData = (data: any[]) => {
    this._dataValues = funs.sort(funs.unique(data));
    let i = this._dataValues.length;
    this._positions = [...Array(i).keys()].map((e) => (e + 1) / (i + 1));
    this.positionValueMap = new Map();
    while (i--) {
      this.positionValueMap.set(this._dataValues[i], this._positions[i]);
    }

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

  dataToPlot = (data: any | any[] | sprs.SparseArray) => {
    const { expandMin, unitRange, positionValueMap, plotMin, plotRange } = this;

    if (sprs.isArrayLike(data)) {
      let [i, res] = [data.length, new sprs.SparseUint16Array(data)];
      while (i--) {
        if (res.empty[i]) continue;
        const dataPct = positionValueMap.get(data[i]) as number;
        res[i] = plotMin + (-expandMin + dataPct * unitRange) * plotRange;
      }
      return res;
    }
    const dataPct = positionValueMap.get(data) as number;
    return plotMin + (-expandMin + dataPct * unitRange) * plotRange;
  };
}
