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

    // Shift & shrink the scale by the plot margins
    // this.offset =
    //   this.offset + this.direction * this.length * this.margins.lower;
    // this.length = (1 - this.margins.lower - this.margins.upper) * this.length;
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
