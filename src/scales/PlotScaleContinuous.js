import * as sprs from "../sparsearrays.js";
export class PlotScaleContinuous {
  constructor(zero = false) {
    this.defaultize = () => {
      this.dataMin = this.dataMinDefault;
      this.dataMax = this.dataMaxDefault;
    };
    this.setPlotLimits = (min, max) => {
      this.plotMin = min;
      this.plotMax = max;
      return this;
    };
    this.registerData = (data) => {
      this.setDataLimits(Math.min(...data), Math.max(...data), true);
      return this;
    };
    this.setDataLimits = (min, max, def = false) => {
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
    this.expandDataLimits = (min, max, def = false) => {
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
    this.pctToPlot = (pct) => {
      const { plotMin, plotRange } = this;
      if (Array.isArray(pct)) {
        let [i, res] = [pct.length, Array(pct.length)];
        while (i--) res[i] = plotMin + pct[i] * plotRange;
        return res;
      }
      return plotMin + pct * plotRange;
    };
    this.plotToPct = (plot) => {
      const { plotMin, plotRange } = this;
      if (Array.isArray(plot)) {
        let [i, res] = [plot.length, Array(plot.length)];
        while (i--) res[i] = (plot[i] - plotMin) / plotRange;
        return res;
      }
      return (plot - plotMin) / plotRange;
    };
    this.dataToPlot = (data) => {
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
    this.plotToData = (plot) => {
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
    this.keyPressed = (key) => {
      if (key === "KeyR") this.defaultize();
    };
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
}
