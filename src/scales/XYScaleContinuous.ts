import { ScaleContinuous } from "./ScaleContinuous.js";

export class XYScaleContinuous extends ScaleContinuous {
  margins: { lower: number; upper: number };

  constructor(
    length: number,
    direction = 1,
    zero = false,
    expand = 0.1,
    margins = { lower: 0.2, upper: 0.1 }
  ) {
    super(length, direction, zero, expand);
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
