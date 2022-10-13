import { ScaleDiscrete } from "./ScaleDiscrete.js";

export class XYScaleDiscrete extends ScaleDiscrete {
  margins: { lower: number; upper: number };

  constructor(
    length: number,
    direction = 1,
    expand = 0.1,
    margins = { lower: 0.2, upper: 0.1 }
  ) {
    super(length, direction, expand);
    this.margins = margins;
    this.span = 1 - margins.lower - margins.upper;
  }

  get offset() {
    return (
      this.offsetOriginal +
      this.direction * this.lengthOriginal * this.margins.lower
    );
  }

  get plotMin() {
    return this.pctToUnits(0);
  }

  get plotMax() {
    return this.pctToUnits(1);
  }

  get intervalWidth() {
    return Math.abs(
      this.dataToPlot(this.values[0]) - this.dataToPlot(this.values[1])
    );
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
