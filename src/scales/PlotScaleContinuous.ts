import * as funs from "../functions.js";
import { ScaleContinuous } from "./ScaleContinuous.js";

export class PlotScaleContinuous {
  readonly continuous: boolean;
  dataScale: ScaleContinuous;
  expandScale: ScaleContinuous;
  plotScale: ScaleContinuous;
  expandMin: number;
  expandMax: number;
  zero: boolean;

  constructor(zero = false) {
    this.continuous = true;
    this.dataScale = new ScaleContinuous();
    this.expandScale = new ScaleContinuous().setLimits(0, 1);
    this.plotScale = new ScaleContinuous();
    this.zero = zero;
    this.expandMin = 0;
    this.expandMax = 0;
  }

  get dataRepresentation() {
    const { dataScale, zero, expandMin, expandMax } = this;
    const min = zero ? 0 : dataScale.pctToUnits(0 - expandMin);
    const max = dataScale.pctToUnits(1 + expandMax);

    return [min, max];
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
    this.expandMin += min;
    this.expandMax += max;
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

  dataToPlot = (data: null | number | number[]) => {
    const { dataScale, expandScale, plotScale } = this;
    return plotScale.pctToUnits(
      expandScale.unitsToPct(dataScale.unitsToPct(data))
    );
  };
}
