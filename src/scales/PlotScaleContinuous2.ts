import * as funs from "../functions.js";
import { ScaleContinuous2 } from "./ScaleContinuous2.js";

export class PlotScaleContinuous2 {
  dataScale: ScaleContinuous2;
  expandScale: ScaleContinuous2;
  plotScale: ScaleContinuous2;
  zero: boolean;

  constructor(zero) {
    this.dataScale = new ScaleContinuous2();
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
    this.dataScale.setLimits(this.zero ? 0 : funs.min(data), funs.max(data));
    return this;
  };

  pctToPlot = (pct: number | number[]) => {
    return this.plotScale.pctToUnits(pct);
  };

  dataToPlot = (data: number | number[]) => {
    const { dataScale, expandScale, plotScale } = this;
    return plotScale.pctToUnits(
      expandScale.unitsToPct(dataScale.unitsToPct(data))
    );
  };
}
