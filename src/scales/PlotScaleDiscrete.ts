import { ScaleContinuous } from "./ScaleContinuous.js";
import { ScaleDiscrete } from "./ScaleDiscrete.js";

export class PlotScaleDiscrete {
  readonly continuous: boolean;
  dataScale: ScaleDiscrete;
  expandScale: ScaleContinuous;
  plotScale: ScaleContinuous;
  zero: boolean;
  expandMin: number;
  expandMax: number;

  constructor(zero = false) {
    this.continuous = false;
    this.dataScale = new ScaleDiscrete();
    this.expandScale = new ScaleContinuous().setLimits(0, 1);
    this.plotScale = new ScaleContinuous();
    this.zero = zero;
    this.expandMin = 0;
    this.expandMax = 0;
  }

  get dataRepresentation() {
    return this.dataScale.values;
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
    this.expandMin += min;
    this.expandMax += max;
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
    return plotScale.pctToUnits(dataScale.unitsToPct(data));
  };
}
