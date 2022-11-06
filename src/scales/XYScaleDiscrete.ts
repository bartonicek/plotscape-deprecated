import { Plot } from "../main.js";
import { ScaleDiscrete } from "./ScaleDiscrete.js";

export class XYScaleDiscrete extends ScaleDiscrete {
  constructor(length: number, plot: Plot, direction = 1, expand = 0.1) {
    super(length, plot, direction, expand);
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
    return this.pctToUnits(0);
  }

  get plotMax() {
    return this.pctToUnits(1);
  }

  get intervalWidth() {
    const { values, dataToPlot } = this;
    return Math.abs(dataToPlot(values[0]) - dataToPlot(values[1]));
  }

  dataToPlot = (data: any | any[]) => {
    return this.dataToUnits(data);
  };

  pctToPlot = (pct: number | number[]) => {
    return this.pctToUnits(pct);
  };

  plotToPct = (units: number | number[]) => {
    return this.unitsToPct(units);
  };
}
