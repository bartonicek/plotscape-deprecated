import * as funs from "../functions.js";
import * as sprs from "../sparsearrays.js";

export class PlotScaleDiscrete {
  readonly continuous: boolean;
  readonly zero: boolean;
  plotMin: number;
  plotMax: number;
  private dataMin: number;
  private dataMax: number;
  private dataMaxDefault: number;
  private dataMinDefault: number;
  private dataValues: any[];
  private positions: number[];
  positionValueMap: Map<any, number>;

  constructor() {
    this.continuous = false;
    this.plotMin = 0;
    this.plotMax = 0;
    this.dataMin = 0;
    this.dataMax = 1;
    this.dataMinDefault = 0;
    this.dataMaxDefault = 1;
  }

  get plotRange() {
    return this.plotMax - this.plotMin;
  }

  get dataRepresentation() {
    const { positions, dataValues, dataMin, dataMax } = this;
    let [i, res] = [dataValues.length, []];
    while (i--) {
      if (positions[i] > dataMin && positions[i] < dataMax) {
        res.push(dataValues[i]);
      }
    }
    return res;
  }

  get dataRange() {
    return this.dataMax - this.dataMin;
  }

  get breakWidth() {
    // Get the plot distance between either the first two or last two values
    const { dataValues, dataToPlot } = this;
    let vals = [0, 1, dataValues.length - 2, dataValues.length - 1];
    vals = vals.map((e) => dataToPlot(dataValues[e]) as number);
    return Math.max(Math.abs(vals[1] - vals[0]), Math.abs(vals[3] - vals[2]));
  }

  defaultize = () => {
    this.dataMin = this.dataMinDefault;
    this.dataMax = this.dataMaxDefault;
  };

  setPlotLimits = (min: number, max: number) => {
    this.plotMin = min;
    this.plotMax = max;
    return this;
  };

  registerData = (data: any[]) => {
    this.dataValues = funs.sort(funs.unique([...data]));
    let i = this.dataValues.length;
    this.positions = [...Array(i).keys()].map((e) => (e + 1) / (i + 1));
    this.positionValueMap = new Map();
    while (i--) {
      this.positionValueMap.set(this.dataValues[i], this.positions[i]);
    }
    return this;
  };

  setDataLimits = (min: number, max: number, def = false) => {
    if (def) {
      this.dataMinDefault = this.zero ? 0 : min;
      this.dataMaxDefault = max;
      this.dataMin = this.dataMinDefault;
      this.dataMax = this.dataMaxDefault;
      return;
    }
    this.dataMin = this.zero ? 0 : min;
    this.dataMax = max;
  };

  expandDataLimits = (min: number, max: number, def = false) => {
    const { dataRange } = this;
    if (def) {
      this.dataMinDefault -= min * dataRange;
      this.dataMaxDefault += max * dataRange;
      this.dataMin = this.dataMinDefault;
      this.dataMax = this.dataMaxDefault;
      return;
    }
    this.dataMin -= min * dataRange;
    this.dataMax += max * dataRange;
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

  plotToPct = (plot: number | number[]) => {
    const { plotMin, plotRange } = this;
    if (Array.isArray(plot)) {
      let [i, res] = [plot.length, Array(plot.length) as number[]];
      while (i--) res[i] = (plot[i] - plotMin) / plotRange;
      return res;
    }
    return (plot - plotMin) / plotRange;
  };

  dataToPlot = (data: any | any[] | sprs.SparseArray) => {
    const { dataMin, dataRange, positionValueMap, plotMin, plotRange } = this;

    if (sprs.isArrayLike(data)) {
      let [i, res] = [data.length, new sprs.SparseUint16Array(data)];
      while (i--) {
        if (res.empty[i]) continue;
        const dataPct = positionValueMap.get(data[i]);
        res[i] = Math.max(
          plotMin + ((dataPct - dataMin) / dataRange) * plotRange,
          0
        );
      }
      return res;
    }
    const dataPct = positionValueMap.get(data);
    return Math.max(plotMin + ((dataPct - dataMin) / dataRange) * plotRange, 0);
  };

  keyPressed = (key: string) => {
    if (key === "KeyR") this.defaultize();
  };
}
