import { Plot } from "../main.js";
import { ScaleContinuous } from "./ScaleContinuous.js";

export class XYScaleContinuous extends ScaleContinuous {
  constructor(
    length: number,
    plot: Plot,
    direction = 1,
    zero = false,
    expand = { lower: 0.1, upper: 0.1 }
  ) {
    super(length, plot, direction, zero, expand);
  }

  get margins() {
    return {
      lower: 4 * this.plot.fontsize,
      upper: 2 * this.plot.fontsize,
    };
  }

  get offset() {
    return this.offsetOriginal + this.direction * this.margins.lower;
  }

  get length() {
    return this.lengthOriginal - this.margins.lower - this.margins.upper;
  }

  get plotMin() {
    return this.pctToUnits(0) as number;
  }

  get plotMax() {
    return this.pctToUnits(1) as number;
  }

  dataToPlot = (data: number | number[]) => {
    return this.dataToUnits(data);
  };

  plotToData = (units: number | number[]) => {
    return this.unitsToData(units);
  };

  pctToPlot = (pct: number | number[]) => {
    return this.pctToUnits(pct);
  };

  plotToPct = (units: number | number[]) => {
    return this.unitsToPct(units);
  };
}
