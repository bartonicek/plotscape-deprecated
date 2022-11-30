import * as sprs from "../sparsearrays.js";

export class PlotScaleContinuous {
  readonly continuous: boolean;
  readonly zero: boolean;
  plotMin: number;
  plotMax: number;
  private dataMin: number;
  private dataMax: number;
  private dataMinDefault: number;
  private dataMaxDefault: number;

  constructor(zero = false) {
    this.continuous = true;
    this.zero = zero;
    this.plotMin = 0;
    this.plotMax = 0;
    this.dataMin = 0;
    this.dataMax = 0;
    this.dataMinDefault = 0;
    this.dataMaxDefault = 0;
  }

  get plotRange() {
    return this.plotMax - this.plotMin;
  }

  get dataRange() {
    return this.dataMax - this.dataMin;
  }

  get dataRepresentation() {
    return [this.dataMin, this.dataMax];
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

  registerData = (data: number[]) => {
    this.setDataLimits(Math.min(...data), Math.max(...data), true);
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
    const { zero, dataRange } = this;
    if (def) {
      if (!zero) this.dataMinDefault -= min * dataRange;
      this.dataMaxDefault += max * dataRange;
      if (!zero) this.dataMin = this.dataMinDefault;
      this.dataMax = this.dataMaxDefault;
      return;
    }
    if (!zero) this.dataMin -= min * dataRange;
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
      let [i, res] = [plot.length, Array(plot.length)];
      while (i--) res[i] = (plot[i] - plotMin) / plotRange;
      return res;
    }
    return (plot - plotMin) / plotRange;
  };

  dataToPlot = (data: number | number[] | sprs.SparseArray) => {
    const { dataMin, dataRange, plotMin, plotRange } = this;
    if (sprs.isArrayLike(data)) {
      let [i, res] = [data.length, new sprs.SparseUint16Array(data)];
      while (i--) {
        if (res.empty[i]) continue;
        const dataPct = (data[i] - dataMin) / dataRange;
        res[i] = Math.max(plotMin + dataPct * plotRange, 0);
      }
      return res;
    }
    const dataPct = (data - dataMin) / dataRange;
    return Math.max(plotMin + dataPct * plotRange, 0);
  };

  plotToData = (plot: number | number[]) => {
    const { dataMin, dataRange, plotMin, plotRange } = this;
    if (sprs.isArrayLike(plot)) {
      let [i, res] = [plot.length, new sprs.SparseFloat32Array(plot)];
      while (i--) {
        const plotPct = (plot[i] - plotMin) / plotRange;
        res[i] = dataMin + plotPct * dataRange;
      }
      return res;
    }
    const plotPct = (plot - plotMin) / plotRange;
    return dataMin + plotPct * dataRange;
  };

  keyPressed = (key: string) => {
    if (key === "KeyR") this.defaultize();
  };
}
