import { ScaleContinuous2 } from "./ScaleContinuous2.js";
import { ScaleDiscrete2 } from "./ScaleDiscrete2.js";

export class PlotScaleDiscrete2 {
  dataScale: ScaleDiscrete2;
  expandScale: ScaleContinuous2;
  plotScale: ScaleContinuous2;
  zero: boolean;

  constructor(zero = false) {
    this.dataScale = new ScaleDiscrete2();
    this.expandScale = new ScaleContinuous2().setLimits(0, 1);
    this.plotScale = new ScaleContinuous2();
    this.zero = zero;
  }

  get plotMin() {
    return this.pctToPlot(0) as number;
  }

  get plotMax() {
    return this.pctToPlot(1) as number;
  }

  get breakWidth() {
    let vals = this.dataScale.values.filter((e, i) => i < 2);
    vals = vals.map((e) => this.dataToPlot(e) as number);
    return Math.abs(vals[1] - vals[0]);
  }

  expand = (min: number, max: number) => {
    this.expandScale.min -= min;
    this.expandScale.max += max;
    return this;
  };

  setPlotLimits = (min: number, max: number) => {
    this.plotScale.setLimits(min, max);
    return this;
  };

  registerData = (data: number[]) => {
    this.dataScale.setValues(data);
    return this;
  };

  pctToPlot = (pct: number | number[]) => {
    return this.plotScale.pctToUnits(pct);
  };

  dataToPlot = (data: any | any[]) => {
    const { dataScale, expandScale, plotScale } = this;
    return plotScale.pctToUnits(
      expandScale.unitsToPct(dataScale.unitsToPct(data))
    );
  };
}
